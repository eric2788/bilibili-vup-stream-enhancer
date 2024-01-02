import type { PlasmoCSConfig, PlasmoCSUIAnchor, PlasmoRender } from "plasmo"
import { Fragment } from "react"
import { createRoot, type Root } from "react-dom/client"
import { ensureIsVtuber, getNeptuneIsMyWaifu, getStreamInfo, isNativeVtuber, type StreamInfo } from "~api/bilibili"
import { getForwarder } from "~background/forwards"
import { shouldInit, type Settings } from "~settings"
import { getRoomId } from "~utils/bilibili"
import { retryCatcher, withFallbacks, withRetries } from "~utils/fetch"
import func from "~utils/func"
import { getFullSettingStroage } from "~utils/storage"
import features, { type FeatureType } from "../features"
import hookAdapter from "~adapters"

interface RootMountable {
  feature: FeatureType
  mount: () => Promise<void>
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
function createMountPoints(plasmo: PlasmoSpec, settings: Settings, info: StreamInfo): RootMountable[] {

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
      mount: async () => {
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



function createApp(roomId: string, plasmo: PlasmoSpec, settings: Settings, info: StreamInfo): App {

  const { anchor, OverlayApp, rootContainer } = plasmo
  const mounters = createMountPoints({ rootContainer, anchor, OverlayApp }, settings, info)

  const section = document.createElement('section')
  section.id = "bjf-root"
  rootContainer.appendChild(section)

  // this root is main root
  let root: Root = null

  return {
    async start(): Promise<void> {
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
      await Promise.all(mounters.map(m => m.mount()))
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

    const settings = await getFullSettingStroage()
    const info = await withFallbacks<StreamInfo>(getStreamInfoFallbacks.map(f => f(getRoomId())))

    if (!info) {
      console.info('無法取得直播資訊，已略過')
      return
    }

    const rootContainer = await createRootContainer(anchor)
    const forwarder = getForwarder('command', 'content-script')

    await hookAdapter(settings)

    const app = createApp(roomId, { rootContainer, anchor, OverlayApp }, settings, info)

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


function App(props: { roomId: string, settings: Settings, info: StreamInfo }): JSX.Element {
  console.info('render main app content!')
  return (<></>)
}