
import storage, { getSettingStorage, localStorage } from '~utils/storage'
import { sendInternal } from './messages'
import { type MV2Settings } from '~migrations/schema'
import semver from 'semver'
import migrateFromMV2 from '~migrations'
import { getLatestRelease } from '~api/github'
import { formatVersion } from "~utils/misc"

chrome.runtime.onInstalled.addListener(async (data: chrome.runtime.InstalledDetails) => {

    const { version } = chrome.runtime.getManifest()

    if (data.reason === 'install') { // 第一次安裝

        try {
            await sendInternal('fetch-developer')
            await sendInternal('notify', {
                title: 'bilibili-vup-stream-enhancer 已安裝',
                message: '成功从远端获取最新设定'
            })
        } catch (err: Error | any) {
            console.error(err)
            await sendInternal('notify', {
                title: 'bilibili-vup-stream-enhancer 已安裝',
                message: '获取远端最新设定失败，将使用本地版本'
            })
        }


    } else if (data.reason === 'update') {

        await sendInternal('notify', {
            title: 'bilibili-vup-stream-enhancer 已更新',
            message: `已更新到版本 v${version}`,
            buttons: [
                {
                    title: '查看更新日志',
                    clicked: () => sendInternal('open-tab', { url: `https://github.com/eric2788/bilibili-vup-stream-enhancer/releases/tag/${version}` })
                }
            ]
        })

        const lastVersion = (await localStorage.get('last_version')) ?? '0.12.4'
        const mv2 = await storage.get<MV2Settings>('settings')
        if (mv2 && semver.lt(formatVersion(lastVersion), '2.0.0')) {
            try {
                await migrateFromMV2()
                await sendInternal('notify', {
                    title: '已迁移 MV2 设定',
                    message: `已成功迁移 MV2 的旧设定到新的设定格式`,
                })
            } catch (err: any) {
                await sendInternal('notify', {
                    title: '迁移 MV2 设定失败',
                    message: `迁移 MV2 的旧设定到新的设定格式失败，你可稍后到设定页面点击按钮迁移。`,
                })
            }
        }
    }

    await localStorage.set('last_version', version)

})


getSettingStorage('settings.version').then(async (settings) => {
    if (!settings.autoCheckUpdate) return
    const currentVersion = chrome.runtime.getManifest().version
    const latest = await getLatestRelease()
    if (semver.lt(formatVersion(currentVersion), formatVersion(latest.tag_name))) {
        await sendInternal('notify', {
            type: 'list',
            title: 'bilibili-vup-stream-enhancer 已推出新版本',
            items: [
                { title: '当前版本', message: `v${currentVersion}` },
                { title: '最新版本', message: `v${latest.tag_name}` },
                { title: '发布日期', message: new Date(latest.published_at).toDateString() }
            ],
            buttons: [
                {
                    title: '查看更新日志',
                    clicked: () => sendInternal('open-tab', { url: latest.html_url })
                }
            ]
        })
    }
})