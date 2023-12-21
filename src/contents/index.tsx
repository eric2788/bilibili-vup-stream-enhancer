import type { PlasmoCSConfig, PlasmoRender } from "plasmo"
import features from "./features"
import { getFullSettingStroage } from "~utils/storage"
import { getStreamInfo, isNativeVtuber } from "~api/bilibili"
import { getRoomId } from "~utils/misc"
import { catcher, retryCatcher, withRetries } from "~utils/fetch"
import func from "~utils/func"

export const config: PlasmoCSConfig = {
  matches: ["*://live.bilibili.com/*"],
  all_frames: true
}

function App(): JSX.Element {
  console.info('hello world from index.tsx')
  return <></>
}

export const render: PlasmoRender<any> = async ({ anchor }, _, OverlayApp) => {

  const getStreamInfoFunc = func.wrap(getStreamInfo)
  const isNativeVtuberFunc = func.wrap(isNativeVtuber)


  try {
    const roomId = getRoomId()

    if (!roomId) {
      console.info('找不到房間號，已略過')
      return
    }

    

    const info = await retryCatcher(getStreamInfoFunc(roomId), 5)
    const settings = await getFullSettingStroage()

    if (settings["settings.features"].onlyVtuber) {

      if (!info.isVtuber) {
        // do log
        console.info('不是 VTuber，已略過')
        return
      }

      if (settings["settings.features"].noNativeVtuber && (await retryCatcher(isNativeVtuberFunc(info.uid), 5))) {
        // do log
        console.info('是原創 VTuber，已略過')
        return
      }
    }

    const renders = Object.entries(features).map(([key, handler]) => {

    })
  } catch (err: Error | any) {
    console.warn(err)
    return
  }

}


