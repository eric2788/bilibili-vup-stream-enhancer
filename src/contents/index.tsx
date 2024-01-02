import type { PlasmoCSConfig, PlasmoCSUIAnchor, PlasmoRender } from "plasmo"
import { Fragment } from "react"
import { createRoot, type Root } from "react-dom/client"
import { ensureIsVtuber, getNeptuneIsMyWaifu, getStreamInfo, isNativeVtuber, type StreamInfo } from "~api/bilibili"
import { getForwarder } from "~background/forwards"
import type { Settings } from "~settings"
import { getRoomId } from "~utils/bilibili"
import { retryCatcher, withFallbacks, withRetries } from "~utils/fetch"
import func from "~utils/func"
import { getFullSettingStroage } from "~utils/storage"
import features, { type FeatureType } from "../features"

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
  (room: string | number) => () => withRetries(() => getStreamInfo(room), 5),

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
  (room: string | number) => async () => {

    // TODO: move to developer
    const title = document.querySelector<HTMLDivElement>('.text.live-skin-main-text.title-length-limit.small-title')?.innerText ?? ''
    const username = document.querySelector<HTMLAnchorElement>('.room-owner-username')?.innerText ?? ''

    const replay = document.querySelector('.web-player-round-title')
    const ending = document.querySelector('.web-player-ending-panel')

    return {
      room: room.toString(),
      title,
      uid: '0', // 暫時不知道怎麼從dom取得
      username,
      isVtuber: true,
      status: (replay !== null || ending !== null) ? 'offline' : 'online'
    } as StreamInfo
  }
]

async function shouldInit(roomId: number, settings: Settings, info: StreamInfo): Promise<boolean> {

  const isNativeVtuberFunc = func.wrap(isNativeVtuber)

  if (settings["settings.listings"].blackListRooms.some((r) => r.room === roomId.toString()) === !settings["settings.listings"].useAsWhiteListRooms) {
    console.info('房間已被列入黑名單，已略過')
    return false
  }


  if (!info) {
    // do log
    console.info('無法取得直播資訊，已略過')
    return false
  }

  if (settings["settings.features"].onlyVtuber) {

    if (info.uid !== '0') {
      await ensureIsVtuber(info)
    }

    if (!info.isVtuber) {
      // do log
      console.info('不是 VTuber, 已略過')
      return false
    }

    if (settings["settings.features"].noNativeVtuber && (await retryCatcher(isNativeVtuberFunc(info.uid), 5))) {
      // do log
      console.info('檢測到為國V, 已略過')
      return false
    }
  }

  return true
}


async function hookAdapter(settings: Settings) {

}


// createMountPoints will not start or the stop the app
function createMountPoints(plasmo: PlasmoSpec, settings: Settings, info: StreamInfo): RootMountable[] {

  const { anchor, OverlayApp, rootContainer } = plasmo

  return Object.entries(features).map(([key, handler]) => {
    const { default: hook, App, init, dispose } = handler

    const section = document.createElement('section')
    section.id = `bjf-feature-${key}`
    rootContainer.appendChild(section)

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
          <OverlayApp anchor={anchor} >
            <Fragment key={key}>
              {Root}
              {portals}
            </Fragment>
          </OverlayApp>
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



function createApp(roomId: number, plasmo: PlasmoSpec, settings: Settings, info: StreamInfo): App {

  const { anchor, OverlayApp, rootContainer } = plasmo
  const mounters = createMountPoints({ rootContainer, anchor, OverlayApp }, settings, info)

  return {
    async start(): Promise<void> {
      if (!(await shouldInit(roomId, settings, info))) {
        console.info('不符合初始化條件，已略過')
        return
      }
      console.info('開始渲染元素....')
      await Promise.all(mounters.map(m => m.mount()))
      console.info('渲染元素完成')
    },
    stop: async () => {
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


