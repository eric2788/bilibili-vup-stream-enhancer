import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendInternal } from '~background/messages'
import { setSettingStorage } from '~utils/storage'

const developerLink = `https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/cdn/developer.json`


export type RequestBody = {}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { data: developer, error } = await sendInternal('request', { url: developerLink })
    if (error) {
        await sendInternal('notify', {
            title: '获取远端开发设定失败',
            message: error,
        })
        return
    }
    await setSettingStorage('settings.developer', developer)
}

export default handler