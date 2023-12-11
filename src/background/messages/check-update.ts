import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendInternal } from "~background/messages"
import updaters from "~updater"

export const browser = process.env.PLASMO_BROWSER || 'chrome'
export const { version } = chrome.runtime.getManifest()


export async function notifyUpdate(version: string): Promise<void> {
    await sendInternal('notify', {
        title: 'bilibili-jimaku-filter 有可用的更新',
        message: `新版本 v${version || 'SNAPSHOT'}`,
        buttons: [
            {
                title: '下載更新',
                clicked: update
            },
            {
                title: '查看更新日誌',
                clicked: () => {
                    chrome.tabs.create({
                        url: `https://github.com/eric2788/bilibili-jimaku-filter/releases/tag/${version}`
                    })
                }
            }
        ]
    })
}

export async function checkUpdate(): Promise<chrome.runtime.RequestUpdateCheckResult> {
    const { checkUpdate } = updaters[browser] ?? updaters['chrome']
    return await checkUpdate(version)
}


export async function update(): Promise<void> {
    try {
        const { update } = updaters[browser] ?? updaters['chrome']
        await update()
    } catch (err: Error | any) {
        console.error(err)
        await sendInternal('notify', {
            title: '更新失敗',
            message: err.message ?? err
        })
    }
}

export type RequestBody = {}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {
    const { status, version } = await checkUpdate()
    if (status === 'update_available') {
        await notifyUpdate(version)
    } else if (status === 'no_update') {
        await sendInternal('notify', {
            title: 'bilibili-jimaku-filter 已是最新版本',
            message: `當前版本 v${version || 'SNAPSHOT'}`
        })
    } else {
        await sendInternal('notify', {
            title: '檢查更新失敗',
            message: `无法索取版本消息，请稍后再尝试。`
        })
    }
    res.send({ status, version })
}


export default handler