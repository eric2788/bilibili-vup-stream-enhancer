import getSettings, { roomId, logSettings, isTheme, sleep } from './utils/misc'
import { connect, closeDatabase } from './utils/database'
import { webRequest, sendNotify, setSettings, openStreamWindow, goToSetting } from './utils/messaging'
import { cancelJimakuFunction, launchJimakuInspect } from './jimaku'
import { cancelSuperChatFunction, launchSuperChatInspect } from './superchat'
import ws from './utils/ws-listener'



const key = `live_room.${roomId}`

// return array
// [buttonOnly, skipped]
async function filterNotV(settings, times = 0) {
    if (!settings.vtbOnly) {
        return [false, false]
    }
    console.log('啟用僅限虛擬主播。')
    try {
        const data = await webRequest(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomId}`)
        //  找不到主播 
        if (data.code != 0) {
            console.warn(`找不到房間為 ${roomId} 的主播，跳過僅限虛擬主播的功能。`)
            return [false, false]
        }

        // 不在直播中
        if (data.data.room_info.live_status != 1) {

            if (!settings.record) {
                console.warn('沒有直播開始, 取消字幕過濾')
            } else {
                const records = JSON.parse(localStorage.getItem(key) ?? '{}')
                if (records.hasLog) {
                    console.log('偵測到本房間有字幕記錄，留下按鈕。')
                    return [true, false]
                } else {
                    console.warn('沒有直播開始, 取消字幕過濾: 1')
                }
            }

            return [false, true]
        }


        // 透過分區來檢查是否虛擬主播
        const checkVByZone = data.data.room_info.parent_area_id != 9;

        try {
            // 基於 ddcenter api 尋找虛擬主播
            const dd = await webRequest(`https://api.vtbs.moe/v1/detail/${data.data.room_info.uid}`);
            console.log(`成功辨識虛擬主播: ${dd.uname}`)
            // 是虛擬主播
            return [false, false]
        } catch (err) {
            console.warn(`從DDCenter請求時出現錯誤: ${err.message}`)
            console.warn('將使用分區檢查虛擬主播')
            return [false, checkVByZone]
        }

    } catch (err) {
        console.warn(err)
        console.warn(`索取資源時出現錯誤: ${err.message}`)
        if (times >= 3) {
            sendNotify({
                title: `已暂时关闭仅限虚拟主播功能。`,
                message: `由于已连续 ${times} 次在索取虚拟主播列表中出现网络请求失败，已暂时关闭仅限虚拟主播功能以让插件正常运作。\n此举将不会影响你的目前设定。`
            })
            return [false, false]
        }
        console.warn('5秒後重新刷新')
        await sleep(5000)
        return await filterNotV(settings, ++times)
    }
}

async function filterCNV(settings, retry = 0) {
    if (!settings.filterCNV) {
        return false
    }

    console.log('已啟用自動過濾國v')
    console.log('請注意: 目前此功能仍在試驗階段, 且不能檢測所有的v。')

    let userId;
    try {
        const res = await webRequest(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`)
        if (res.code != 0) {
            throw new Error(res.message)
        }
        userId = res.data.uid
    } catch (err) {
        console.warn(`获取房间资讯时出现错误: ${err?.message}, 将采用 regex 方式`)
        const usernameJQ = settings.developer.elements.userId
        let i = 0
        while (!$(usernameJQ)?.attr('href') && i < 5) {
            console.log(`cannot find userId ${usernameJQ}, wait for one sec`)
            await sleep(1000)
            i++
        }
        userId = parseInt(/^\/\/space\.bilibili\.com\/(\d+)\/$/g.exec($(usernameJQ)?.attr('href'))?.pop())
    }

    if (!userId || isNaN(userId)) {
        sendNotify({
            title: `过滤国V功能暂时无法使用`,
            message: `由于无法获取此房间的用户ID，因此暂时取消过滤国V功能。`
        })
        return false
    }
    try {
        let i = 1
        while (i < 100) {
            const blsApi = `https://api.live.bilibili.com/xlive/activity-interface/v1/bls2020/getSpecAreaRank?act_id=23&_=1607569699845&period=1&team=1&page=${i}`
            const res = await webRequest(blsApi)
            if (res?.data?.list) {
                const tag = res.data.list.map(s => { return { uid: s.uid, tag: s.tag } }).find(s => s.uid == userId)?.tag
                if (tag === '汉语') {
                    console.log('檢測到為國V房間，已略過。')
                    return true
                }
                i++;
            } else {
                break;
            }
        }
    } catch (err) {
        console.warn(err)
        if (retry >= 5) {
            console.warn(`已重試${retry}次，放棄過濾。`)
            return false
        }
        ++retry
        console.warn('檢測國V時出現錯誤: ' + err.message)
        console.warn(`重試第${retry}次，五秒後重試`)
        await sleep(5000)
        return await filterCNV(settings, retry)
    }
}


async function getLiveTime(retry = 0) {
    try {
        const response = await webRequest(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`)
        if (response?.data?.live_time) {
            return response.data.live_time
        } else {
            throw new Error(response?.message ?? response.code)
        }
    } catch (err) {
        console.warn(err)
        if (retry >= 5) {
            console.warn(`已重試${retry}次，放棄获取。`)
            return undefined
        }
        ++retry
        console.warn(`获取直播开始时间失败，正在重试第${retry}次, 三秒後重试`)
        await sleep(3000)
        return await getLiveTime(retry)
    }
}

function getScriptSrc({ useRemoteCDN }, js) {
    return useRemoteCDN ? `https://cdn.jsdelivr.net/gh/eric2788/bilibili-jimaku-filter@web/${js}` : browser.runtime.getURL(js)
}

// start here
async function start(restart = false) {

    //console.log(`scanning: ${location.href}`)

    if (isNaN(roomId)) {
        console.warn(`invalid roomId ${roomId}, return`)
        return
    }

    console.log('this page is using bilibili jimaku filter')

    if ($('#button-list').length > 0 && !restart) {
        console.log('restarting bilibili jimaku filter')
        cancel()
        await start(true)
        return
    }

    const settings = await getSettings()

    if (!restart) {
        if (!settings.useLegacy) {
            // inject websocket
            const b = `
                <script src="${getScriptSrc(settings, 'cdn/pako.min.js')}"></script>
                <script src="${getScriptSrc(settings, 'cdn/brotli.bundle.js')}"></script>
                <script src="${getScriptSrc(settings, 'cdn/websocket-hook.js')}"></script>
            `
            $(document.head).append(b)
        }
    }

    ws.launchListeners()

    if (settings.blacklistRooms.includes(`${roomId}`) === !settings.useAsWhitelist) {
        console.log('房間ID在黑名單上，已略過。')
        return
    }

    const [buttonOnly, sk1] = await filterNotV(settings)
    if (sk1) return

    if (await filterCNV(settings)) return

    const live_time = await getLiveTime() // 同傳彈幕彈出式視窗也需要 live_time

    let enabledRecord = false
    if (settings.record) {
        console.log('啟用同傳彈幕記錄')
        if (window.indexedDB) {
            try {
                await connect(key)
                if (localStorage.getItem(key) == null) {
                    localStorage.setItem(key, JSON.stringify({ hasLog: false }))
                }
            } catch (err) {
                console.error(err)
                alert(`連接資料庫時出現錯誤: ${err.message}, 自動取消同傳彈幕記錄。`)
                closeDatabase()
                settings.record = false
                enabledRecord = true
            }
        } else {
            alert('你的瀏覽器不支援IndexedDB, 無法啟用同傳彈幕記錄')
            console.warn('你的瀏覽器不支援IndexedDB, 無法啟用同傳彈幕記錄')
            settings.record = false
            // no need to assign enabledRecord because not support indexedb
        }
    }

    const { backgroundListColor: blc, backgroundColor: bc, textColor: tc } = settings.buttonSettings

    const { elements } = settings.developer

    let buttonArea = $(elements.upperButtonArea)

    while (buttonArea.length == 0) {
        console.warn(`無法找到按鈕放置元素 ${elements.upperButtonArea}, 可能b站改了元素，請通知原作者。(isTheme: ${isTheme})`)
        await sleep(1000)
        buttonArea = $(elements.upperButtonArea)
    }
    buttonArea.append(`
        <style id="btn-style">
            .btn-sc {
                background-color: gray;
                color: white;
                padding: 2px 5px;
                font-size: 12px;
                border: none;
                box-shadow: 1px 1px 1px black;
            }
        </style>
    `)
    if (!settings.hideBlackList) {
        buttonArea.append(`
            <a href="javascript: void(0)" class="btn-sc" type="button" id="blacklist-add-btn">
                添加到黑名单
            </a>
        `)

        $('#blacklist-add-btn').on('click', async () => {
            try {
                if (!window.confirm(`确定添加房间号 ${roomId} 为黑名单?`)) return
                settings.blacklistRooms.push(`${roomId}`)
                if (enabledRecord) {
                    settings.record = true // revert the setting before save
                }
                await setSettings(settings)
                cancel()
                await sendNotify({
                    title: "添加成功",
                    message: "已成功添加此房间到黑名单。"
                })
            } catch (err) {
                await sendNotify({
                    title: '添加失败',
                    message: err?.message ?? err
                })
            }
        })
    }

    if (isTheme) {
        buttonArea.append(`
            <a href="javascript: void(0)" class="btn-sc" type="button" id="switch-button-list">
                切換按鈕列表
            </a>
        `)

        $('#switch-button-list').on('click', () => {
            const display = $('div#button-list').css('display') === 'none'
            $('div#button-list').css('display', display ? 'block' : 'none')
            $('#switch-button-list').css('background-color', display ? 'gray' : '#e87676')
        })

        if (settings.themeToNormal) {
            buttonArea.append(`
                <a href="https://live.bilibili.com/blanc/${roomId}" target="_blank" class="btn-sc" type="button">
                    返回非海报界面
                </a>
            `)
        }
    }

    $(elements.jimakuArea).after(`
        <div id="button-list" style="text-align: center; background-color: ${blc}; overflow-x: auto;">
            <style>
            #button-list .button {
                background-color: ${bc};
                border: none;
                color: ${tc};
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 15px;
                margin: 5px 5px;
                left: 50%;
                cursor: pointer;
            }
            @keyframes top {
                from {
                transform: translateY(-30px);
                opacity: 0;
                }
            }
            @keyframes left {
                from {
                transform: translatex(-50px);
                opacity: 0;
                }
            }
            @keyframes size {
                from {
                font-size: 5px;
                opacity: 0;
                }
            }
            @keyframes y-down {
                from {
                height: 0px;
                opacity: 0;
                }
            }
            </style>
        </div>
    `)

    if (isTheme) {
        $('#switch-button-list').trigger('click')
    }

    if (settings.enableRestart) {
        $('#button-list').append(`<button class="button" id="restart-btn">重新启动</button>`)
        $('#restart-btn').on('click', launchFilter)
    }

    if (!settings.hideSettingBtn){
        $('#button-list').append(`
            <button class="button" id="setting-btn">进入设置</button>
        `)
        $('#setting-btn').on('click', goToSetting)
    }


    if (settings.enableStreamPopup) {
        $('#button-list').append(`<button class="button" id="stream-btn">打开监控式视窗</button>`)
        $('#stream-btn').on('click', async () => {
            try {
                const title = $(elements.liveTitle)[0]?.innerText ?? 'null'
                await openStreamWindow(roomId, title)
                await sendNotify({
                    title: '打开成功',
                    message: `已成功打开监控式视窗。`
                })
            } catch (e) {
                await sendNotify({
                    title: '打开失败',
                    message: e?.message ?? e
                })
            }
        })
    }



    //彈幕過濾
    await launchJimakuInspect(settings, { buttonOnly, liveTime: live_time })

    if (settings.recordSuperChat) {
        //SC过滤
        await launchSuperChatInspect(settings, { buttonOnly, restart })
    }
}

function launchFilter() {
    start().catch(console.error)
}

launchFilter()

window.onunload = function () {
    const { changed, hasLog, hasSCLog } = logSettings
    if (changed) {
        localStorage.setItem(key, JSON.stringify({ hasLog, hasSCLog }))
    }
}

function cancel() {
    $('#button-list').remove()
    $('.btn-sc').remove()
    cancelJimakuFunction()
    cancelSuperChatFunction()
    $('#btn-style').remove()
    $('#switch-button-list').remove()
}

browser.runtime.onMessage.addListener(req => {
    if (req.cmd !== 'restart') return
    console.log('received restart command from background')
    launchFilter()
})