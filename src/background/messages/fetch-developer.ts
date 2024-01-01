import type { PlasmoMessaging } from "@plasmohq/messaging";
import { sendInternal } from '~background/messages';
import { setSettingStorage } from '~utils/storage';

const developerLink = `https://cdn.jsdelivr.net/gh/eric2788/bilibili-jimaku-filter@web/cdn/developer.json`


export type RequestBody = {}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { developer } = await sendInternal('request', { url: developerLink })
    await setSettingStorage('settings.developer', developer)
}

export default handler