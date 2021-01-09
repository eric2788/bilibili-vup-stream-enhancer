import getSettings, { roomId, logSettings, generateToken } from './utils/misc'
import { connect, closeDatabase } from './utils/database'
import { webRequest, sendNotify, setSettings } from './utils/messaging'
import { cancelJimakuFunction, launchJimakuInspect } from './jimaku'
import { cancelSuperChatFunction, launchSuperChatInspect } from './superchat'
const userReg = /^\/\/space\.bilibili\.com\/(\d+)\/$/g
const userId = parseInt(userReg.exec($('a.room-owner-username')?.attr('href'))?.pop())

if (isNaN(roomId)) {
    console.warn('未知直播房間。')
    throw new Error('未知直播房間。')
}

const key = `live_room.${roomId}`

// Injecting web socket inspector on start
const b = `
    <script src="${browser.runtime.getURL('cdn/pako.min.js')}"></script>
    <script src="${browser.runtime.getURL('cdn/blive-proxy.js')}"></script>
`
$(document.head).append(b)

async function sleep(ms) {
    return new Promise((res,) => setTimeout(res, ms))
}

async function filterNotV(settings) {
    let buttonOnly = false
    let skipped = false
    if (settings.vtbOnly) {
        console.log('啟用僅限虛擬主播。')
        try {
            const data = await webRequest('https://vup.darkflame.ga/api/online')
            if (!data.list.some(y => y.shortId == roomId || y.roomId == roomId)) {
                if (!settings.record) {
                    console.warn('不是虛擬主播房間或沒在直播, 取消字幕過濾')
                    skipped = true
                } else {
                    const records = JSON.parse(localStorage.getItem(key) ?? '{}')
                    if (records.hasLog) {
                        console.log('偵測到本房間有字幕記錄，留下按鈕。')
                        buttonOnly = true
                    } else {
                        console.warn('不是虛擬主播房間或沒在直播, 取消字幕過濾: 1')
                        skipped = true
                    }
                }

            }
        } catch (err) {
            console.warn(err)
            console.warn(`索取資源時出現錯誤: ${err.message}`)
            console.warn('三秒後重新刷新')
            await sleep(3000)
            return await filterNotV(settings)
        }
    }
    return { buttonOnly, skipped }
}

async function filterCNV(settings, retry = 0) {
    if (settings.filterCNV) {
        console.log('已啟用自動過濾國v')
        console.log('請注意: 目前此功能仍在試驗階段, 且不能檢測所有的v。')
        if (isNaN(userId)) {
            alert('無法獲得此直播房間的用戶ID房間，將自動取消過濾國V功能。')
        } else {
            let i = 1
            try {
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
                if (retry >= 5){
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
    }
    return false
}

let proxyActivated = false

let csrfToken = generateToken()

window.addEventListener('bjf:command', ({ detail: { cmd, data } }) => {
    if (!cmd.startsWith('e') && data.csrfToken !== csrfToken){
        console.warn('token not match, skipped command')
        return
    }
    switch(cmd){
        case "e-proxy-activated":
            proxyActivated = true
            console.log('proxy activated.')
            break;
        case "send-notify":
            sendNotify(data)
            break;
        default:
            break;
    }
    if (!cmd.startsWith('e')){
        csrfToken = generateToken()
    }
}, true)


async function getLiveTime(retry = 0){
    try {
        const response = await webRequest(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`)
        if (response?.data?.live_time) {
            return response.data.live_time
        } else {
            throw new Error(response?.message ?? response.code)
        } 
    }catch(err){
        console.warn(err)
        if (retry >= 5){
            console.warn(`已重試${retry}次，放棄获取。`)
            return undefined
        }
        ++retry
        console.warn(`获取直播开始时间失败，正在重试第${retry}次, 三秒後重试`)
        await sleep(3000)
        return await getLiveTime(retry)
    }
}

// start here
async function start(restart = false){
    console.log('this page is using bilibili jimaku filter')
    const roomLink = $('a.room-owner-username').attr('href')
    if (!roomLink) {
        console.log('the room is theme room, skipped')
        return
    }

    const settings = await getSettings()

    if (settings.blacklistRooms.includes(`${roomId}`) === !settings.useAsWhitelist) {
        console.log('房間ID在黑名單上，已略過。')
        return
    }

    const { buttonOnly, skipped: sk1 } = await filterNotV(settings)
    if (sk1) return

    if (await filterCNV(settings)) return

    let live_time = undefined

    if (settings.record) {
        console.log('啟用同傳彈幕記錄')
        if (window.indexedDB) {
            try {
                await connect(key)
                live_time = await getLiveTime()
                if (localStorage.getItem(key) == null){
                    localStorage.setItem(key, JSON.stringify({hasLog: false}))
                }
            } catch (err) {
                console.error(err)
                alert(`連接資料庫時出現錯誤: ${err.message}, 自動取消同傳彈幕記錄。`)
                closeDatabase()
                settings.record = false
            }
        } else {
            alert('你的瀏覽器不支援IndexedDB, 無法啟用同傳彈幕記錄')
            console.warn('你的瀏覽器不支援IndexedDB, 無法啟用同傳彈幕記錄')
            settings.record = false
        }
    }

    const { backgroundListColor: blc, backgroundColor: bc, textColor: tc } = settings.buttonSettings

    $('div.room-info-ctnr.dp-i-block').append(`
        <a href="javascript: void(0)" class="btn-sc" type="button" id="blacklist-add-btn">
            添加到黑名单
            <style>
            .btn-sc {
                background-color: gray;
                color: white;
                padding: 5px;
                font-size: 12px;
                border: none;
                box-shadow: 1px 1px 5px black;
            }
            </style>
        </a>
    `)

    $('#blacklist-add-btn').on('click', async () => {
        try {
            if (!window.confirm(`确定添加房间号 ${roomId} 为黑名单?`)) return 
            settings.blacklistRooms.push(`${roomId}`)
            await setSettings(settings)
            cancel()
            await sendNotify({
                title: "添加成功",
                message: "已成功添加此房间到黑名单。"
            })
        }catch(err){
            await sendNotify({
                title: '添加失败',
                message: err?.message ?? err
            })
        }
    })

    $('div.player-section').after(`
        <div id="button-list" style="text-align: center; background-color: ${blc}">
            <style>
            .button {
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

    if (settings.enableRestart){
        $('#button-list').append(`<button class="button" id="restart-btn">重新启动</button>`)
        $('#restart-btn').on('click', relaunch)
    }
    //彈幕過濾
    await launchJimakuInspect(settings, { buttonOnly, liveTime: live_time })
    
    if (settings.recordSuperChat){
         //SC过滤
        await launchSuperChatInspect(settings, { buttonOnly, restart })
    }

    if (restart) return
    const { forceAlterWay } = settings.webSocketSettings
    setTimeout(() => {
        if (!proxyActivated && (forceAlterWay || window.confirm('Bliveproxy 貌似挂接失败，需要切换第三方监控WebSocket吗？'))){
            const s = 
            `<script>
                WebSocket.prototype._send = WebSocket.prototype.send;
                WebSocket.prototype.send = function (data) {
                    this._send(data);
                    this.addEventListener('message', function (msg) {
                        const event = new CustomEvent('ws:bliveproxy', { detail: msg })
                        window.dispatchEvent(event)
                    }, true);
                    console.log('websocket injected by alternative way')
                    const event = new CustomEvent('bjf:command', {detail: {
                        cmd: 'send-notify',
                        data: {
                            title: '第三方监控挂接成功',
                            message: 'WebSocket 已被成功挂接。',
                            csrfToken: '${csrfToken}'
                        }
                    }})
                    window.dispatchEvent(event)
                    this.send = this._send
                }
            </script>
            `
            $(document.body).prepend(s)
            sendNotify({
                title: '正在採用第三方监控 WebSocket....',
                message: '挂接过程可能长达十五秒, 且将无法置顶置底弹幕'
            })
        }
    }, 5000)
}


start().catch(console.error)

window.onunload = function () {
    const {changed, hasLog, hasSCLog } = logSettings
    if (changed){
        localStorage.setItem(key, JSON.stringify({ hasLog, hasSCLog }))
    }
}

function cancel(){
    $('#button-list').remove()
    cancelJimakuFunction()
    cancelSuperChatFunction()
    $('#blacklist-add-btn').remove()
}

function relaunch(){
    cancel()
    start(true).catch(console.error)
}

browser.runtime.onMessage.addListener(req => {
    if (req.cmd !== 'restart') return
    console.log('received restart command from background')
    relaunch()
})