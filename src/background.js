import { browserAction, contextMenus, notifications, runtime } from 'webextension-polyfill'
import getSettings, { getUserAgent, isChrome, isEdge, isFirefox, isOpera, roomReg } from './utils/misc'

console.log('background is working...')

const DEVELOPER_LINK = 'https://cdn.jsdelivr.net/gh/eric2788/bilibili-jimaku-filter@web/cdn/developer.json'

browserAction.onClicked.addListener(goToSetting)

contextMenus.create({
    id: 'add-black-list',
    title: '添加到黑名单',
    documentUrlPatterns: ['https://live.bilibili.com/*'],
    contexts: ['page'],
    enabled: true
})

let lastMenuId = 0
let nextMenuId = 0

// firefox only
if (contextMenus.onShown) {
    contextMenus.onShown.addListener(async (info,) => {

        let menuInstanceId = nextMenuId++;
        lastMenuId = menuInstanceId;

        const settings = await getSettings()

        console.log(info)

        if (menuInstanceId !== lastMenuId) {
            return; // Menu was closed and shown again.
        }

        const url = new URL(info.pageUrl)
        roomReg.lastIndex = 0
        const roomId = roomReg.exec(url.pathname)?.groups?.id
        if (!roomId) {
            console.warn(`unknown room id (${url.pathname})`)
        }

        await contextMenus.update('add-black-list', {
            enabled: roomId && !settings.blacklistRooms.includes(roomId)
        })

        // firefox only
        await contextMenus.refresh()
    })
}

// chrome/edge
contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "add-black-list":
            // firefox
            if (contextMenus.onShown) {
                browser.tabs.sendMessage(tab.id, { cmd: 'black-list' })
            } else {
                const settings = await getSettings()
                const url = new URL(info.pageUrl)
                roomReg.lastIndex = 0
                const roomId = roomReg.exec(url.pathname)?.groups?.id
                if (!roomId) {
                    console.warn(`unknown room id (${url.pathname})`)
                }
                if (roomId && !settings.blacklistRooms.includes(roomId)){
                    await browser.tabs.sendMessage(tab.id, { cmd: 'black-list' })
                }else{
                    await sendNotify({
                        title: '你已添加过此房间到黑名单。',
                        message: '已略过操作。'
                    })
                }
            }
            break
        default:
            return
    }
})

function goToSetting() {
    browser.tabs.create({
        url: browser.runtime.getURL('settings.html')
    })
}

async function sendNotify({ title, message }) {
    console.log('sending notification')
    return browser.notifications.create({
        type: 'basic',
        title,
        message,
        iconUrl: browser.runtime.getURL('icons/icon.png')
    }).catch(console.error)
}

async function sendNotifyId(id, data) {
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

async function checkUpdateWithAPI() {
    const link = auto_update_supported[userAgent]
    if (!link) {
        throw new Error('this browser is not support auto update')
    }
    const [status, update] = await browser.runtime.requestUpdateCheck()
    if (status === 'update_available') {
        return {
            ...update,
            update_link: link
        }
    }
    if (status === 'throttled') {
        throw new Error('update is throttled')
    }
    return {
        version: currentVersion,
        update_link: link
    }
}

async function getAutoUpdateSupported() {
    return (await fetcher(updateApi))?.auto_update_supported ?? {}
}

async function checkUpdateOther() {
    let latestv = undefined
    const addons = (await fetcher(updateApi))?.addons
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
        } catch (err) {
            console.warn(err)
            console.warn(`use back original checking way`)
            latest = await checkUpdateOther()
        }
        if (!latest) {
            if (notify) {
                await sendNotify({
                    title: '检查版本失败',
                    message: '无法索取最新版本讯息。'
                })
            }
            return
        } else if (currentVersion.newerThan(latest.version)) {
            if (notify) {
                await sendNotify({
                    title: '没有可用的更新',
                    message: '你的版本已经是最新版本。'
                })
            }
            return
        }

        if (isFirefox || isOpera) {
            await sendNotifyId('bjf:update', {
                title: 'bilibili-jimaku-filter 有可用的更新',
                message: `新版本 v${latest.version}\n可到扩充管理手动更新或等待自动更新`
            })
        } else {
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

// start here
getSettings().then(({ autoCheckUpdate }) => {
    if (autoCheckUpdate) {
        checkUpdate()
    }
})


async function fetcher(url, timer = 15000) {
    const aborter = new AbortController()
    const timeout = setTimeout(() => aborter.abort(), timer)
    const res = await fetch(url, { signal: aborter.signal })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
    const json = await res.json()
    return json
}

async function openWindow(roomId, title = 'null') {
    return browser.windows.create({
        url: browser.runtime.getURL(`jimaku.html?roomId=${roomId}&title=${title}`),
        type: 'panel',
        width: 500,
        height: 700
    })
}

runtime.onMessage.addListener((message) => {
    console.log('received command: ' + message.type)
    switch (message.type) {
        case "notify":
            sendNotify(message.data)
            break;
        case "go-settings":
            goToSetting()
            break;
        case "get-settings":
            return getSettings()
        case "save-settings":
            return browser.storage.sync.set(message.data)
        case "request":
            console.log(`received request ${message.url} with timeout ${message.timer}`)
            return fetcher(message.url, message.timer)
        case "log-info":
            console.info(message.data)
            break;
        case "log-error":
            console.error(message.data)
            break;
        case "check-update":
            checkUpdate(true)
            break;
        case "open-window":
            return openWindow(message.roomId, message.title)
        case "fetch-developer":
            return fetcher(DEVELOPER_LINK).then(data => data.developer)
        default:
            break;
    }
})

function logLink(version) {
    return `https://github.com/eric2788/bilibili-jimaku-filter/releases/tag/${version}`
}

function downloadLink(latest) {
    if (isEdge && auto_update_supported['edge']) {
        return auto_update_supported['edge']
    } else if (isChrome && auto_update_supported['chrome']) {
        return auto_update_supported['chrome']
    } else {
        return latest.update_link
    }
}

notifications.onButtonClicked.addListener(async (nid, bi) => {
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
                await browser.tabs.create({ url: downloadLink(latest) })
                break;
            case 1:
                //查看更新日志
                await browser.tabs.create({ url: logLink(latest.version) })
                break;
        }
    } else if (nid === 'bjf:updated') {
        await browser.tabs.create({ url: logLink(currentVersion) })
    }

})




async function onFirstTimeIntsall() { // 第一次安裝執行

    // 獲取開發者相關最新版本以取代舊設定
    const { developer } = await fetcher(DEVELOPER_LINK)
    const settings = await getSettings()
    settings.developer = { ...settings.developer, ...developer } // override
    await browser.storage.sync.set(settings)

}

runtime.onInstalled.addListener(async data => {
    if (data.reason === 'install') { // 第一次安裝
        await onFirstTimeIntsall()
            .then(() => sendNotifyId('bjf:installed', {
                title: 'bilibili-jimaku-filter 已安裝',
                message: '成功从远端获取最新设定'
            }))
            .catch(() => sendNotifyId('bjf:error', {
                title: 'bilibili-jimaku-filter 已安裝',
                message: '获取远端最新设定失败，将使用本地版本'
            }))
    }
    if (data.reason !== 'update') return
    if (isFirefox || isOpera) {
        await sendNotifyId('bjf:updated', {
            title: 'bilibili-jimaku-filter 已更新',
            message: `已更新到版本 v${currentVersion}`
        })
    } else {
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