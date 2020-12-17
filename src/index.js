import getSettings from './js/utils'
import { connect, pushRecord, listRecords, clearRecords, close } from './js/database'
import { sendNotify, webRequest } from './js/messaging'

const config = { attributes: false, childList: true, subtree: true };

// Injecting web socket inspector on start
const b = `
    <script src="${browser.runtime.getURL('cdn/pako.min.js')}"></script>
    <script src="${browser.runtime.getURL('cdn/blive-proxy.js')}"></script>
`
$(document.head).append(b)

// for reassign
//let $$$ = $

const beforeInsert = []

const roomReg = /^\/(?<id>\d+)/g
const roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)

const userReg = /^\/\/space\.bilibili\.com\/(\d+)\/$/g
const userId = parseInt(userReg.exec($('a.room-owner-username')?.attr('href'))?.pop())

const colorReg = /^#[0-9A-F]{6}$/ig

if (isNaN(roomId)) {
    console.warn('未知直播房間。')
    throw new Error('未知直播房間。')
}

let bottomInterval = -1

const key = `live_room.${roomId}`

const Observer = window.MutationObserver

function appendSubtitle(subtitle) {
    $('div#subtitle-list').prepend(`<p>${subtitle}</p>`)
}

function launchBottomInterval() {
    return setInterval(() => {
        const btn = $('div#danmaku-buffer-prompt')
        if (btn.css('display') !== 'none') {
            btn.trigger('click')
        }
    }, 1000)
}

function getTimeStamp() {
    return new Date().toTimeString().substring(0, 8)
}

function getStreamingTime() {
    try {
        const ele = $('[data-title=直播持续时间] > span')
        // 舊直播 UI
        if (ele.length > 0){
            return ele[0].innerText
        }
        // 新直播UI
        const ev = new MouseEvent("mousemove", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: 554,
            clientY: 665
        });
        // 強行召喚時間戳記條
        $('.bilibili-live-player-video-controller')[0].dispatchEvent(ev)
        return $('.tip-wrap')[0].innerText
    }catch(err){
        console.warn('獲取直播串流時間時出現錯誤，將改為獲取真實時間戳記')
        console.error(err)
        return getTimeStamp()
    }
}

function toJimaku(danmaku, regex) {
    if (danmaku !== undefined) {
        const reg = new RegExp(regex)
        const g = reg.exec(danmaku)?.groups
        danmaku = g?.cc
        const name = g?.n
        if (danmaku === "") {
            danmaku = undefined
        }
        return name && danmaku ? `${name}: ${danmaku}` : danmaku
    }
    return danmaku
}

async function danmakuCheckCallback(mutationsList, settings, { hideJimakuDisable, opacityDisable, colorDisable }) {
    for (const mu of mutationsList) {
        if (mu.addedNodes.length < 1) continue
        for (const node of mu.addedNodes) {
            const danmaku = node?.innerText?.trim() ?? node?.data?.trim()
            if (toJimaku(danmaku, settings.regex) !== undefined) {
                const n = node.innerText !== undefined ? node : node.parentElement
                const jimaku = $(n)
                if (!hideJimakuDisable) {
                    jimaku.css('display', 'none')
                    return
                }
                if (!opacityDisable) {
                    const o = (settings.opacity / 100).toFixed(1)
                    jimaku.css('opacity', o)
                }
                if (!colorDisable) {
                    jimaku.css('color', settings.color)
                }
            }
        }
    }
}

function launchDanmakuStyleChanger(settings) {
    const opacityDisable = settings.opacity == -1
    const colorDisable = !colorReg.test(settings.color)
    const hideJimakuDisable = !settings.hideJimakuDanmaku
    if (opacityDisable && colorDisable && hideJimakuDisable) return
    const danmakuObserver = new Observer((mu, obs) => danmakuCheckCallback(mu, settings, { hideJimakuDisable, opacityDisable, colorDisable }).catch(console.warn))
    danmakuObserver.observe($('.bilibili-live-player-video-danmaku')[0], config)
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

async function filterCNV(settings) {
    if (settings.filterCNV) {
        console.log('已啟用自動過濾國v')
        console.log('請注意: 目前此功能仍在試驗階段, 且不能檢測所有的v。')
        if (isNaN(userId)) {
            alert('無法獲得此直播房間的用戶ID房間，將自動取消過濾國V功能。')
        } else {
            let i = 1
            try {
                while (true) {
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
                console.warn('error while fetching data: ' + err.message)
                console.warn('try after 5 secs')
                await sleep(5000)
                return await filterCNV(settings)
            }
        }
    }
    return false
}

// start
async function process() {
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

    if (settings.record) {
        console.log('啟用同傳彈幕記錄')
        if (window.indexedDB) {
            try {
                await connect(key)
                if (localStorage.getItem(key) == null){
                    localStorage.setItem(key, JSON.stringify({hasLog: false}))
                }
            } catch (err) {
                console.error(err)
                alert(`連接資料庫時出現錯誤: ${err.message}, 自動取消同傳彈幕記錄。`)
                close()
                settings.record = false
            }
        } else {
            alert('你的瀏覽器不支援IndexedDB, 無法啟用同傳彈幕記錄')
            console.warn('你的瀏覽器不支援IndexedDB, 無法啟用同傳彈幕記錄')
            settings.record = false
        }
    }


    const { backgroundListColor: blc, backgroundColor: bc, textColor: tc } = settings.buttonSettings
    const { backgroundColor: bgc, subtitleColor: stc, backgroundHeight: bgh } = settings

    $('div.player-section').after(`
        <div id="button-list" style="text-align: center; background-color: ${blc}">
            <button id="clear-record" class="button">删除所有字幕记录</button>
        </div>
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
        </style>
    `)
    if (settings.record) {
        $('#button-list').append('<button id="download-record" class="button">下载字幕记录</button>')
        $('button#download-record').on('click', downloadLog)
    }
    $('button#clear-record').on('click', () => clearLogs(settings.record).catch(console.warn))
    if (buttonOnly) return
    $('div.player-section').after(`
        <div id="subtitle-list" class="subtitle-normal"></div>
        <style>
        .subtitle-normal {
            background-color: ${bgc}; 
            width: 100%; 
            height: ${bgh}px; 
            position: relative;
            z-index: 3;
            overflow-y: auto; 
            text-align: center;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: ${stc} ${bgc};
        }
        .subtitle-normal::-webkit-scrollbar {
            width: 5px;
        }
         
        .subtitle-normal::-webkit-scrollbar-track {
            background-color: ${bgc};
        }
         
        .subtitle-normal::-webkit-scrollbar-thumb {
            background-color: ${stc};
        }
        @keyframes trans {
            from {
              transform: translateY(-30px);
              opacity: 0;
            }
          }
          div#subtitle-list p {
              animation: trans .3s ease-out;
              font-weight: bold;
              color: ${settings.subtitleColor}; 
              opacity: 1.0; 
              margin: ${settings.lineGap}px;
              font-size: ${settings.subtitleSize}px;  
          }
        </style>
    `)
    if (!settings.useWebSocket) {
        $('#button-list').append(`
            <input type="checkbox" id="keep-bottom">
            <label for="keep-bottom">保持聊天栏最底(否则字幕无法出现)</label><br>
        `)
        $('input#keep-bottom').on('click', e => {
            const checked = $(e.target).prop('checked')
            if (checked) {
                bottomInterval = launchBottomInterval()
            } else {
                clearInterval(bottomInterval)
            }
        })
    }

    // 屏幕彈幕監控
    launchDanmakuStyleChanger(settings)

    const previousRecord = await new Promise((res,) => listRecords().then(res).catch(() => res([])))
    for (const rec of previousRecord) {
        appendSubtitle(rec.text)
        if (!settings.useWebSocket) beforeInsert.push(rec.text)
    }

    if (settings.useWebSocket) {
        // WebSocket 监控
        wsMonitor(settings)
    } else {
        // 聊天室監控
        chatMonitor(settings)
    }

    // 全屏切換監控
    new Observer((mu, obs) => {
        const currentState = $(mu[0].target).attr('data-player-state')
        if (currentState === lastState) return
        const fullScreen = currentState === 'web-fullscreen' || currentState === 'fullscreen'
        fullScreenTrigger(fullScreen, settings)
        lastState = currentState
    }).observe($('.bilibili-live-player.relative')[0], { attributes: true })
}

const logSettings = {
    changed: false,
    hasLog: true
}

function pushSubtitle(subtitle, settings) {
    appendSubtitle(subtitle)
    const date = settings.useStreamingTime ? getStreamingTime() : getTimeStamp()
    if (settings.record) {
        pushRecord({
            date,
            text: subtitle
        }).then(() => {
            logSettings.hasLog = true
            logSettings.changed = true
        }).catch(console.warn)
    }
}

function chatMonitor(settings) {
    const callback = async function (mutationsList) {
        for (const mu of mutationsList) {
            if (mu.addedNodes.length < 1) continue
            for (const node of mu.addedNodes) {
                const danmaku = $(node)?.attr('data-danmaku')?.trim()
                if (danmaku) console.debug(danmaku)
                const subtitle = toJimaku(danmaku, settings.regex)
                if (subtitle !== undefined) {
                    if (beforeInsert.shift() === subtitle) {
                        continue
                    }
                    pushSubtitle(subtitle, settings)
                }
            }
        }
    }
    const observer = new Observer((mlist, obs) => callback(mlist).catch(console.warn));
    observer.observe($('#chat-items')[0], config);
}

let proxyActivated = false

window.addEventListener('ws:proxy-initialized', () => {
    proxyActivated = true
    console.log('proxy activated.')
})

function wsMonitor(settings) {
    const { danmakuPosition, forceAlterWay } = settings.webSocketSettings
    window.addEventListener('ws:bilibili-live', ({ detail: { cmd, command } }) => {
        if (cmd === 'DANMU_MSG') {
            const danmaku = command.info[1]
            if (danmaku) console.debug(danmaku)
            const jimaku = toJimaku(danmaku, settings.regex)
            if (jimaku !== undefined) {
                pushSubtitle(jimaku, settings)
                //在使用 websocket 的情况下，可以强制置顶和置底弹幕
                switch (danmakuPosition) {
                    case "top":
                        command.info[0][1] = 5
                        break;
                    case "bottom":
                        command.info[0][1] = 4
                        break;
                    default:
                        break;
                }
            }
        }
    })
    setTimeout(() => {
        if (!proxyActivated && (forceAlterWay || window.confirm('Bliveproxy 貌似挂接失败，需要切换第三方监控WebSocket吗？\n如果本直播间尚在初始化，则可能为误判'))){
            const s = 
            `<script>
                WebSocket.prototype._send = WebSocket.prototype.send;
                WebSocket.prototype.send = function (data) {
                    this._send(data);
                    this.addEventListener('message', function (msg) {
                        const event = new CustomEvent('ws:bliveproxy', { detail: msg })
                        window.dispatchEvent(event)
                    }, true);
                    this.send = this._send
                }
                console.log('websocket injected by alternative way')
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

let lastState = 'normal'

function downloadLog() {
    console.debug('downloading log...')
    listRecords().then(st => {
        if (st.length == 0) {
            sendNotify({ title: '下载失败', message: '字幕记录为空。' })
            return
        }
        const a = document.createElement("a");
        const file = new Blob([st.map(s => `[${s.date}] ${s.text}`).join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = `subtitles-${roomId}-${new Date().toISOString().substring(0, 10)}.log`
        a.click();
        URL.revokeObjectURL(url)
        sendNotify({ title: '下载成功', message: '你的字幕记录已保存。' })
    }).catch(err => {
        sendNotify({ title: '下载失敗', message: err.message })
    })
}

async function clearLogs(record = false) {
    console.debug('deleting log...')
    const hasJimaku = record ? (await listRecords()).length > 0 : $('div#subtitle-list > p').length > 0
    if (!hasJimaku) {
        sendNotify({ title: '刪除失敗', message: '字幕记录为空。' })
        return
    }

    if (!record) {
        $('div#subtitle-list > p').remove()
        sendNotify({ title: '刪除成功', message: '此直播房间的字幕记录已被清空。' })
    } else {
        try {
            await clearRecords()
            $('div#subtitle-list > p').remove()
            sendNotify({ title: '刪除成功', message: '此直播房间的字幕记录已被清空。' })
            logSettings.hasLog = false
            logSettings.changed = true
        } catch (err) {
            sendNotify({ title: '刪除失敗', message: err.message })
        }
    }


}

function toRgba(hex, opacity) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity})`;
    }
    console.warn('bad Hex: ' + hex);
    return hex
}

let lastStyle = undefined
function fullScreenTrigger(check, settings) {
    const element = $('div#subtitle-list')
    const cfg = { disabled: !check }
    element.draggable(cfg)
    element.resizable(cfg)

    if (!check) {
        lastStyle = element.attr('style')
        element.removeAttr('style')
        $('div#button-list').before(element)
    } else {
        element.css({
            'z-index': '9',
            'cursor': 'move',
            'position': 'absolute',
            'bottom': '100px',
            'background-color': toRgba(settings.backgroundColor, (settings.backgroundSubtitleOpacity / 100).toFixed(1)),
            'width': '50%'
        })
        if (lastStyle) element.attr('style', lastStyle)
        element.prependTo($('div.bilibili-live-player-video-area'))
    }

    console.debug('fullscreen is now ' + check)
}

window.onunload = function () {
    const {changed, hasLog} = logSettings
    if (changed){
        localStorage.setItem(key, JSON.stringify({ hasLog }))
    }
}

async function sleep(ms) {
    return new Promise((res,) => setTimeout(res, ms))
}


process().catch(console.error)