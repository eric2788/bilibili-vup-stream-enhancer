import type { PlasmoCSConfig, PlasmoGetStyle, PlasmoRender } from "plasmo";
import { toast } from 'sonner/dist';
import { ensureLogin, getNeptuneIsMyWaifu, getStreamInfo, type StreamInfo } from '~api/bilibili';
import { getForwarder } from '~background/forwards';
import { getRoomId, isOutThemedPage } from '~utils/bilibili';
import { withFallbacks, withRetries } from '~utils/fetch';
import { injectFunction } from '~utils/inject';
import { getSettingStorage, processing, withProcessingFlag } from '~utils/storage';

import styleText from '~styles';
import createApp from './mounter';

import '~logger';
import injectToaster from "~toaster";

export const config: PlasmoCSConfig = {
  matches: ["*://live.bilibili.com/*"],
  all_frames: true,
  run_at: 'document_end'
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

// 多重檢查直播資訊的方式
const getStreamInfoFallbacks = [

  // 1. 使用 API (重試 5 次)
  (room: string) => () => withRetries(() => getStreamInfo(room), 5, {
    onRetry(err, i) {
      toast.warning(`取得直播資訊失敗: ${err.message}，正在重試第${i}次...`, { position: 'top-left' })
    },
    onFinalErr(err) {
      toast.error(`取得直播資訊失敗: ${err.message}, 将采用后备方式获取。`, { position: 'top-left' })
    }
  }),

  // 2. 使用腳本注入
  () => () => getNeptuneIsMyWaifu('roomInfoRes').then(r => ({
    room: r.data.room_info.room_id.toString(),
    title: r.data.room_info.title,
    uid: r.data.room_info.uid.toString(),
    username: r.data.anchor_info.base_info.uname,
    isVtuber: r.data.room_info.parent_area_id !== 9, // 分區辨識
    status: r.data.room_info.live_status === 1 ? 'online' : 'offline',
    liveTime: r.data.room_info.live_start_time
  }) as StreamInfo),
]

let removeHandler: VoidFunction = null

// start from here
export const render: PlasmoRender<any> = async ({ anchor, createRootContainer }, _, OverlayApp) => {

  // for hot reload (if it has?)
  if (removeHandler !== null) {
    removeHandler()
    removeHandler = null
  }

  try {

    // this room id should only use for getStreamInfo
    const roomId = getRoomId()

    if (!roomId) {
      console.info('找不到房間號，已略過: ', location.pathname)
      return
    }

    if (isOutThemedPage()) {
      console.info('檢測到頁面為外圍大海報房間，已略過: ', location.pathname)
      return
    }

    // inject the toaster
    injectToaster();

    // doing fast websocket boost here (if enabled)
    (async function () {
      try {
        const settings = await getSettingStorage('settings.capture')
        if (settings.captureMechanism === 'websocket' && settings.boostWebSocketHook) {
          console.info('boosting websocket hook...')
          await injectFunction('boostWebSocketHook')
        }
      } catch (err: Error | any) {
        console.error(err)
        console.warn('failed to boost websocket hook.')
        toast.error('WebSocket挂接提速失败: ' + err)
      }
    })();

    const login = await ensureLogin()

    console.info('login: ', login)

    if (!login) {
      toast.warning('检测到你尚未登录, 本扩展的功能将会严重受限, 建议你先登录B站。', { position: 'top-center' })
    }

    const info = await withFallbacks<StreamInfo>(getStreamInfoFallbacks.map(f => f(roomId)))

    const rootContainer = await createRootContainer(anchor)
    const forwarder = getForwarder('command', 'content-script')

    const app = createApp(roomId, { rootContainer, anchor, OverlayApp }, info)

    const start = withProcessingFlag(app.start)
    const stop = withProcessingFlag(app.stop)

    removeHandler = forwarder.addHandler(async data => {
      if (data.command === 'stop') {
        await stop()
      } else if (data.command === 'restart') {
        await stop()
        await start()
      }
    })
    // start the app
    await start()

  } catch (err: Error | any) {
    console.error(`渲染 bilibili-vup-stream-enhancer 元素時出現錯誤: `, err)
    return
  }

}







