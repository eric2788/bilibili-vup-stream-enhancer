import type { PlasmoCSConfig } from "plasmo";
import { injectFunction } from "~utils/inject";
import { getSettingStorage } from "~utils/storage";


export const config: PlasmoCSConfig = {
    matches: ['*://static.ericlamm.xyz/*'],
    all_frames: true,
    run_at: 'document_start'
};


console.info('12312313131');

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
      alert('WebSocket挂接提速失败: ' + err)
    }
  })();