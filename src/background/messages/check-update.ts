import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getModuleStreamSync } from "~utils/file"
import type { UpdateAction, UpdateChecker } from "~updater"
import { sendBackground } from "~utils/messaging"

export const browser = process.env.PLASMO_BROWSER || 'chrome'
export const { version } = chrome.runtime.getManifest()


const updaters: {
    [key: string]: {
        checkUpdate: UpdateChecker,
        update: UpdateAction
    }
} = {}

for (const { name, module: updater } of getModuleStreamSync('~updater/*.ts')) {
    updaters[name] = updater
}

export async function notifyUpdate(version: string): Promise<void> {
    await sendBackground('notify', {
        title: 'bilibili-jimaku-filter 有可用的更新',
        message: `新版本 v${version}`,
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
        sendBackground('notify', {
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
        await sendBackground('notify', {
            title: 'bilibili-jimaku-filter 已是最新版本',
            message: `當前版本 v${version}`
        })
    } else {
        await sendBackground('notify', {
            title: '檢查更新失敗',
            message: `无法索取最新版本讯息。`
        })
    }
}


export default handler