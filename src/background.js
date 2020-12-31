import getSettings, { getUserAgent, isChrome, isEdge, isFirefox, isOpera } from './utils/misc'

console.log('background is working...')

browser.browserAction.onClicked.addListener((tab, clickData) => {
    browser.tabs.create({
        url: browser.runtime.getURL('settings.html')
    })
})

async function sendNotify({ title, message }) {
    console.log('sending notification')
    return browser.notifications.create({
        type: 'basic',
        title,
        message,
        iconUrl: browser.runtime.getURL('icons/icon.png')
    }).catch(console.error)
}

async function sendNotifyId(id, data){
    console.log('sending notification with id')
    return browser.notifications.create(id, {
        type: 'basic',
        ...data,
        iconUrl: browser.runtime.getURL('icons/icon.png')
    }).catch(console.error)
}

String.prototype.newerThan = function (version) {
    const current = this.split('.')
    const target = version.split('.')
    for (let i = 0; i < Math.max(current.length, target.length); i++) {
        const cv = i < current.length ? parseInt(current[i]) : 0
        const tv = i < target.length ? parseInt(target[i]) : 0
        if (cv > tv) {
            return true
        } else if (cv < tv) {
            return false
        }
    }
    return true
}


const currentVersion = browser.runtime.getManifest().version
const updateApi = browser.runtime.getManifest().applications.gecko.update_url
const updateID = browser.runtime.getManifest().applications.gecko.id

let latest = undefined
let auto_update_supported = {}
let userAgent = getUserAgent()

async function checkUpdateWithAPI(){
    const link = auto_update_supported[userAgent]
    if (!link){
        throw new Error('this browser is not support auto update')
    }
    const [status, update] = await browser.runtime.requestUpdateCheck()
    if (status === 'update_available'){
        return {
            ...update,
            update_link: link
        }
    }
    if (status === 'throttled'){
        throw new Error('update is throttled')
    }
    return {
        version: currentVersion,
        update_link: link
    }
}

async function getAutoUpdateSupported(){
    return (await webRequest(updateApi))?.auto_update_supported ?? []
}

async function checkUpdateOther(){
    let latestv = undefined
    const addons = (await webRequest(updateApi))?.addons
    if (addons) {
        const verList = addons[updateID]?.updates
        if (verList) {
            for (const update of verList) {
                if (update.version.newerThan(latestv?.version ?? "")) {
                    latestv = update
                }
            }
        }
    }
    return latestv
}

async function checkUpdate(notify = false) {
    try {
        console.log('checking update')
        auto_update_supported = await getAutoUpdateSupported()
        try {
            latest = await checkUpdateWithAPI()
        }catch(err){
            console.warn(err)
            console.warn(`use back original checking way`)
            latest = await checkUpdateOther()
        }
        if (!latest) {
            if (notify){
                    await sendNotify({
                        title: '检查版本失败',
                        message: '无法索取最新版本讯息。'
                    })
            }
            return
        } else if (currentVersion.newerThan(latest.version)){
            if (notify){
                await sendNotify({
                    title: '没有可用的更新',
                    message: '你的版本已经是最新版本。'
                })
            }
            return
        }

        if (isFirefox || isOpera){
            await sendNotifyId('bjf:update', {
                title: 'bilibili-jimaku-filter 有可用的更新',
                message: `新版本 v${latest.version}\n可到扩充管理手动更新或等待自动更新`
            })
        }else{
            await sendNotifyId('bjf:update', {
                title: 'bilibili-jimaku-filter 有可用的更新',
                message: `新版本 v${latest.version}`,
                buttons: [
                    {
                        title: '下载更新'
                    },
                    {
                        title: '查看更新日志'
                    }
                ]
            })
        }
    } catch (err) {
        console.error(err)
        await sendNotify({
            title: '检查更新失败',
            message: err.message
        })
    }
    return latest
}

getSettings().then(({autoCheckUpdate})=>{
    if (autoCheckUpdate){
        checkUpdate()
    }
})


async function webRequest(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
    const json = await res.json()
    return json
}

browser.runtime.onMessage.addListener((message, { tab }) => {
    console.log('received command: ' + message.type)
    switch (message.type) {
        case "notify":
            sendNotify(message.data)
            break;
        case "get-settings":
            return getSettings()
        case "save-settings":
            return browser.storage.sync.set(message.data)
        case "request":
            return webRequest(message.url)
        case "log-info":
            console.info(message.data)
            break;
        case "log-error":
            console.error(message.data)
            break;
        case "check-update":
            checkUpdate(true)
            break;
        default:
            break;
    }
})

function logLink(version){
    return `https://github.com/eric2788/bilibili-jimaku-filter/releases/tag/${version}`
}

function downloadLink(latest){
    if (isEdge && auto_update_supported['edge']){
        return auto_update_supported['edge']
    }else if (isChrome && auto_update_supported['chrome']) {
        return auto_update_supported['chrome']
    }else {
        return latest.update_link
    }
}

browser.notifications.onButtonClicked.addListener(async (nid, bi) => {
    if (nid === 'bjf:update') {
        if (latest === undefined) {
            await sendNotify({
                title: '索取新版本信息失败。',
                message: '请稍后再尝试。'
            })
            return
        }
        switch (bi) {
            case 0:
                //下载更新
                await browser.tabs.create({ url: downloadLink(latest)})
                break;
            case 1:
                //查看更新日志
                await browser.tabs.create({ url: logLink(latest.version) })
                break;
        }
    } else if (nid === 'bjf:updated'){
        await browser.tabs.create({url: logLink(currentVersion)})
    }
    
})

browser.runtime.onInstalled.addListener(async data => {
    if (data.reason !== 'update') return
    if (isFirefox || isOpera){
        await sendNotifyId('bjf:updated', {
            title: 'bilibili-jimaku-filter 已更新',
            message: `已更新到版本 v${currentVersion}`
        })
    }else{
        await sendNotifyId('bjf:updated', {
            title: 'bilibili-jimaku-filter 已更新',
            message: `已更新到版本 v${currentVersion}`,
            buttons: [
                {
                    title: '查看更新日志'
                }
            ]
        })
    }
})