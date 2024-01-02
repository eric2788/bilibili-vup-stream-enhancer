import { Button, Drawer, IconButton, Typography } from "@material-tailwind/react"
import { useMutationObserver, useToggle } from "@react-hooks-library/core"
import type { PlasmoCSConfig, PlasmoCSUIAnchor, PlasmoRender } from "plasmo"
import extIcon from 'raw:~assets/icon.png'
import { Fragment, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import hookAdapter from "~adapters"
import { getNeptuneIsMyWaifu, getStreamInfo, type StreamInfo } from "~api/bilibili"
import { getForwarder } from "~background/forwards"
import BJFThemeProvider from "~components/BJFThemeProvider"
import TailwindScope from "~components/TailwindScope"
import { shouldInit, type Settings } from "~settings"
import { injectTailwind } from "~tailwindcss"
import { getRoomId, isDarkThemeBilbili } from "~utils/bilibili"
import { withFallbacks, withRetries } from "~utils/fetch"
import { isDarkTheme } from "~utils/misc"
import { getFullSettingStroage } from "~utils/storage"
import features, { type FeatureType } from "../features"

interface RootMountable {
  feature: FeatureType
  mount: (settings: Settings) => Promise<void>
  unmount: () => Promise<void>
}

interface PlasmoSpec {
  rootContainer: Element
  anchor: PlasmoCSUIAnchor
  OverlayApp?: any
  InlineApp?: any
}


interface App {
  start(): Promise<void>
  stop(): Promise<void>
}


export const config: PlasmoCSConfig = {
  matches: ["*://live.bilibili.com/*"],
  all_frames: true
}


// 多重檢查直播資訊的方式
const getStreamInfoFallbacks = [

  // 1. 使用 API (重試 5 次)
  (room: string) => () => withRetries(() => getStreamInfo(room), 5),

  // 2. 使用腳本注入
  () => () => getNeptuneIsMyWaifu('roomInfoRes').then(r => ({
    room: r.data.room_info.room_id.toString(),
    title: r.data.room_info.title,
    uid: r.data.room_info.uid.toString(),
    username: r.data.anchor_info.base_info.uname,
    isVtuber: r.data.room_info.parent_area_id !== 9, // 分區辨識
    status: r.data.room_info.live_status === 1 ? 'online' : 'offline'
  }) as StreamInfo),

  // 3. 使用 DOM query
  (room: string) => async () => {

    // TODO: move to developer
    const title = document.querySelector<HTMLDivElement>('.text.live-skin-main-text.title-length-limit.small-title')?.innerText ?? ''
    const username = document.querySelector<HTMLAnchorElement>('.room-owner-username')?.innerText ?? ''

    const replay = document.querySelector('.web-player-round-title')
    const ending = document.querySelector('.web-player-ending-panel')

    return {
      room: room,
      title,
      uid: '0', // 暫時不知道怎麼從dom取得
      username,
      isVtuber: true,
      status: (replay !== null || ending !== null) ? 'offline' : 'online'
    } as StreamInfo
  }
]


// createMountPoints will not start or the stop the app
function createMountPoints(plasmo: PlasmoSpec, info: StreamInfo): RootMountable[] {

  const { rootContainer } = plasmo

  return Object.entries(features).map(([key, handler]) => {
    const { default: hook, App, init, dispose } = handler

    const section = document.createElement('section')
    section.id = `bjf-feature-${key}`
    rootContainer.appendChild(section)

    // this root is feature root
    let root: Root = null

    return {
      feature: key as FeatureType,
      mount: async (settings: Settings) => {
        if (init) {
          // for extra init
          await init()
        }
        root = createRoot(section)
        const portals = await hook(settings, info)
        const Root: React.ReactNode = App ? await App(settings, info) : <></>
        root.render(
          <Fragment key={key}>
            {Root}
            {portals}
          </Fragment>
        )
      },
      unmount: async () => {
        if (dispose) {
          // for extra dispose
          await dispose()
        }
        if (root === null) {
          console.warn('root is null, maybe not mounted yet')
          return
        }
        root.unmount()
      }
    }
  })

}



function createApp(roomId: string, plasmo: PlasmoSpec, info: StreamInfo): App {

  const { anchor, OverlayApp, rootContainer } = plasmo
  const mounters = createMountPoints({ rootContainer, anchor, OverlayApp }, info)

  const section = document.createElement('section')
  section.id = "bjf-root"
  rootContainer.appendChild(section)

  // this root is main root
  let root: Root = null

  return {
    async start(): Promise<void> {

      const settings = await getFullSettingStroage()

      if (!(await shouldInit(roomId, settings, info))) {
        console.info('不符合初始化條件，已略過')
        return
      }
      // 渲染主元素
      root = createRoot(section)
      console.info('開始渲染主元素....')
      root.render(
        <App
          roomId={roomId}
          settings={settings}
          info={info}
        />
      )
      console.info('渲染主元素完成')
      // 渲染功能元素
      console.info('開始渲染元素....')
      await Promise.all(mounters.map(m => m.mount(settings)))
      console.info('渲染元素完成')
    },
    stop: async () => {
      if (root === null) {
        console.warn('root is null, maybe not mounted yet')
        return
      }
      // 卸載主元素
      console.info('開始卸載主元素....')
      root.unmount()
      console.info('卸載主元素完成')
      // 卸載功能元素
      console.info('開始卸載元素....')
      await Promise.all(mounters.map(m => m.unmount()))
      console.info('卸載元素完成')
    }
  }
}


let removeHandler: VoidFunction = null

// start from here
export const render: PlasmoRender<any> = async ({ anchor, createRootContainer }, _, OverlayApp) => {

  // for hot reload (if it has?)
  if (removeHandler !== null) {
    removeHandler()
    removeHandler = null
  }

  try {
    const roomId = getRoomId()

    if (!roomId) {
      console.info('找不到房間號，已略過')
      return
    }

    const info = await withFallbacks<StreamInfo>(getStreamInfoFallbacks.map(f => f(getRoomId())))

    if (!info) {
      console.info('無法取得直播資訊，已略過')
      return
    }

    const rootContainer = await createRootContainer(anchor)
    const forwarder = getForwarder('command', 'content-script')

    const app = createApp(roomId, { rootContainer, anchor, OverlayApp }, info)

    removeHandler = forwarder.addHandler(async data => {
      if (data.command === 'stop') {
        await app.stop()
      } else if (data.command === 'restart') {
        await app.stop()
        await app.start()
      }
    })

    // start the app
    await app.start()

  } catch (err: Error | any) {
    console.error(`渲染 bilibili-jimaku-filter 元素時出現錯誤: `, err)
    return
  }

}


type AppProps = {
  roomId: string
  settings: Settings
  info: StreamInfo
}


function App(props: AppProps): JSX.Element {

  const { info, settings, roomId } = props

  const {
    "settings.display": displaySettings,
    "settings.features": featureSettings,
    "settings.button": buttonSettings
  } = settings

  console.info(buttonSettings)

  const { bool: open, setFalse: closeDrawer, toggle } = useToggle(false)

  useEffect(() => {
    const player = document.querySelector('.player-section')
    player.setAttribute('style', 'z-index: 9999')
  }, [])

  const [dark, setDark] = useState(() => isDarkTheme() && isDarkThemeBilbili())

  // watch bilibili theme changes
  useMutationObserver(document.documentElement, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lab-style') {
        setDark(() => isDarkTheme() && isDarkThemeBilbili())
      }
    }
  }, { attributes: true })

  return (
    <BJFThemeProvider dark={dark}>
      <TailwindScope dark={dark}>
        <div className="fixed top-72 left-0 rounded-r-2xl shadow-md p-3 bg-white dark:bg-gray-800">
          <button onClick={toggle} className="flex flex-col justify-center items-center text-center gap-3">
            <img src={extIcon} alt="bjf" height={26} width={26} />
            <span className="text-md text-gray-800 dark:text-white">同传过滤</span>
          </button>
        </div>
        <Drawer placement="right" open={open} onClose={closeDrawer} className={`p-4 bg-gray-300 dark:bg-gray-800 shadow-md`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex justify-start items-start flex-col">
              <Typography variant="h5" className="dark:text-white">
                {info.username} 的直播间
              </Typography>
              <Typography variant="small" className="dark:text-white">
                Bilibili Jimaku Filter
              </Typography>
            </div>
            <IconButton variant="text" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <div className="flex flex-col px-2 py-3 gap-4">
            {displaySettings.blackListButton &&
              <Button size="lg" >添加到黑名单</Button>}
            {displaySettings.settingsButton &&
              <Button size="lg" >进入设置</Button>}
            {displaySettings.restartButton &&
              <Button size="lg" >重新启动</Button>}
            {featureSettings.monitorWindow &&
              <Button size="lg" >打开监控式视窗</Button>}
          </div>
        </Drawer>
      </TailwindScope>
    </BJFThemeProvider>
  )
}
