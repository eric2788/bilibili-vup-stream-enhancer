import type { PlasmoCSConfig, PlasmoRender } from "plasmo"
import { Fragment } from "react"
import { createRoot } from "react-dom/client"
import { getNeptuneIsMyWaifu, getStreamInfo, isNativeVtuber, type StreamInfo } from "~api/bilibili"
import { retryCatcher, withFallbacks, withRetries } from "~utils/fetch"
import func from "~utils/func"
import { getRoomId } from "~utils/misc"
import { getFullSettingStroage } from "~utils/storage"
import features from "./features"

export const config: PlasmoCSConfig = {
  matches: ["*://live.bilibili.com/*"],
  all_frames: true
}


// 多重檢查直播資訊的方式
const getStreamInfoFallbacks = [

  // 1. 使用 API
  (room: string | number) => () => withRetries(() => getStreamInfo(room), 5),

  // 2. 使用腳本注入
  () => () => getNeptuneIsMyWaifu('roomInfoRes').then(r => ({
    room: r.data.room_info.room_id.toString(),
    title: r.data.room_info.title,
    uid: r.data.room_info.uid.toString(),
    username: r.data.anchor_info.base_info.uname,
    isVtuber: r.data.room_info.parent_area_id != 9, // 分區辨識
    status: r.data.room_info.live_status === 1 ? 'online' : 'offline'
  }) as StreamInfo),

  // 3. 使用 DOM query
  (room: string | number) => async () => {

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


export const render: PlasmoRender<any> = async ({ anchor, createRootContainer }, _, OverlayApp) => {


  const isNativeVtuberFunc = func.wrap(isNativeVtuber)

  try {

    const roomId = getRoomId()

    if (!roomId) {
      console.info('找不到房間號，已略過')
      return
    }

    const info: StreamInfo = await withFallbacks<StreamInfo>(getStreamInfoFallbacks.map(f => f(roomId)))

    if (!info) {
      // do log
      console.info('無法取得直播資訊，已略過')
      return
    }

    const settings = await getFullSettingStroage()

    if (settings["settings.features"].onlyVtuber) {

      if (!info.isVtuber) {
        // do log
        console.info('不是 VTuber, 已略過')
        return
      }

      if (settings["settings.features"].noNativeVtuber && (await retryCatcher(isNativeVtuberFunc(info.uid), 5))) {
        // do log
        console.info('檢測到為國V, 已略過')
        return
      }
    }


    const rootContainer = await createRootContainer(anchor)


    console.info('開始渲染元素....')

    await Promise.all(
      Object.entries(features).map(async ([key, handler]) => {
        const { default: hook, App } = handler
        const portals = await hook(settings, info)

        const Root: React.ReactNode = App ? await App(settings, info) : <></>

        const section = document.createElement('section')
        section.id = `bjf-feature-${key}`
        rootContainer.appendChild(section)

        const root = createRoot(section)

        root.render(
          <OverlayApp anchor={anchor} >
            <Fragment key={key}>
              {Root}
              {portals}
            </Fragment>
          </OverlayApp>
        )

      })
    )

    console.info('渲染元素完成')

  } catch (err: Error | any) {
    console.error(`渲染 bilibili-jimaku-filter 元素時出現錯誤: `, err)
    return
  }

}


