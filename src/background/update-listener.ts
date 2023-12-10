
import { sendInternal } from './messages'
import { version, notifyUpdate } from './messages/check-update'
import { storage } from '~utils/storage'


const developerLink = `https://cdn.jsdelivr.net/gh/eric2788/bilibili-jimaku-filter@web/cdn/developer.json`


chrome.runtime.onInstalled.addListener(async (data: chrome.runtime.InstalledDetails) => {
    
    if (data.reason === 'install') { // 第一次安裝

        try {
            await fetchRemoteDeveloper()
            await sendInternal('notify', {
                title: 'bilibili-jimaku-filter 已安裝',
                message: '成功从远端获取最新设定'
            })
        } catch (err: Error | any) {
            console.error(err)
            await sendInternal('notify', {
                title: 'bilibili-jimaku-filter 已安裝',
                message: '获取远端最新设定失败，将使用本地版本'
            })
        }


    } else if (data.reason === 'update') {

        await sendInternal('notify', {
            title: 'bilibili-jimaku-filter 已更新',
            message: `已更新到版本 v${version}`,
        })   

    }
    
})


chrome.runtime.onUpdateAvailable.addListener((data: chrome.runtime.UpdateAvailableDetails) => notifyUpdate(data.version))




async function fetchRemoteDeveloper(): Promise<void> {
    const { developer } = await sendInternal('request', { url: developerLink }) 
    await storage.set('settings.developer', developer)
}
