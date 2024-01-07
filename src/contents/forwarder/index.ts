import type { PlasmoCSConfig } from "plasmo";
import { addBLiveMessageCommandListener } from "~utils/messaging";
import { sendForward } from "~background/forwards";

export const config: PlasmoCSConfig = {
    matches: ['*://live.bilibili.com/*'],
    all_frames: false,
    run_at: 'document_idle'
}

let remove: VoidFunction = null
if (remove) remove()

// remove = addBLiveMessageListener((data) => {
//     console.info('received from forwarder.ts: ', data.cmd)
// })

remove = addBLiveMessageCommandListener('DANMU_MSG', (data) => {
    const uname = data.info[2][1]
    const text = data.info[1]
    if (Array.isArray(text)) return
    const color = data.info[0][3]
    const position = data.info[0][1]
    sendForward('pages', 'danmaku', { uname, text, color, position })
})


