import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendInternal } from '~background/messages'
import type { SettingSchema as DeveloperSchema } from "~options/fragments/developer"

const developerLink = `https://cdn.jsdelivr.net/gh/eric2788/bilibili-vup-stream-enhancer@web/cdn/developer_v2.json`

export type ResponseBody = { 
    data?: DeveloperSchema, 
    error?: string 
}

const handler: PlasmoMessaging.MessageHandler<{}, ResponseBody> = async (req, res) => {
    const { data, error } = await sendInternal('request', { url: developerLink })
    res.send({ data: data?.developer, error })
}

export default handler