import { pushRecord, listRecords, clearRecords} from './utils/database'
import { sendNotify } from './utils/messaging'
import { toTimer, logSettings, roomId, download } from './utils/misc'

const config = { attributes: false, childList: true, subtree: true };

const beforeInsert = []

const colorReg = /^#[0-9A-F]{6}$/ig

const Observer = window.MutationObserver

function appendSubtitle(subtitle) {
    $('div#subtitle-list').prepend(`<p>${subtitle}</p>`)
}

function getTimeStamp() {
    return new Date().toTimeString().substring(0, 8)
}

function getStreamingTimeFromHtml(){
    const ev = new MouseEvent("mousemove", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 554,
        clientY: 665
    });
    // 強行召喚時間戳記條
    $('.bilibili-live-player-video-controller')[0].dispatchEvent(ev)
    return /[\d:]+/g.exec($('.tip-wrap')[0].innerText).pop()
}

let live_time = undefined

async function getStreamingTime() {
    try {
        const ele = $('[data-title=直播持续时间] > span')
        // 舊直播 UI
        if (ele.length > 0){
            return ele[0].innerText
        }
        // 新直播UI
        if (!live_time){
            console.warn(`找不到開播時間，嘗試改為使用html元素獲取`)
            return getStreamingTimeFromHtml() 
        }else{
            return toTimer(Math.round(Date.now() / 1000) - live_time)
        }
    }catch(err){
        console.warn(err)
        console.warn('獲取直播串流時間時出現錯誤，將改為獲取真實時間戳記')
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

function danmakuCheckCallback(mutationsList, settings, { hideJimakuDisable, opacityDisable, colorDisable }) {
    for (const mu of mutationsList) {
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
    const danmakuObserver = new Observer((mu, ) => danmakuCheckCallback(mu, settings, { hideJimakuDisable, opacityDisable, colorDisable }))
    danmakuObserver.observe($('.bilibili-live-player-video-danmaku')[0], config)
}

function pushSubtitle(subtitle, settings) {
    appendSubtitle(subtitle)
    if (settings.record) {
        const dateGet = settings.useStreamingTime ? getStreamingTime() : Promise((res,)=> res(getTimeStamp()))
        dateGet
        .then((date) => pushRecord({date, text: subtitle}))
        .then(() => {
            logSettings.hasLog = true
            logSettings.changed = true
        })
        .catch(console.warn)
    }
}

function wsMonitor(settings) {
    const { danmakuPosition } = settings.webSocketSettings
    window.addEventListener('ws:bilibili-live', ({ detail: { cmd, command } }) => {
        if (cmd !== 'DANMU_MSG') return
        const userId = command.info[2][0]
        const danmaku = command.info[1]
        if (danmaku) {
            const id = `${danmaku}-${command.info[2][0]}`
            if (beforeInsert.shift() === id) return
            console.debug(danmaku)
            beforeInsert.push(id)
        }
        const isTongChuan = settings.tongchuanMans.includes(`${userId}`)
        const jimaku = isTongChuan ? danmaku : toJimaku(danmaku, settings.regex)
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
    })
}

let lastState = 'normal'

function downloadLog() {
    console.debug('downloading log...')
    listRecords().then(st => {
        if (st.length == 0) {
            sendNotify({ title: '下载失败', message: '字幕记录为空。' })
            return
        }
        const content = st.map(s => `[${s.date}] ${s.text}`).join('\n')
        const filename = `subtitles-${roomId}-${new Date().toISOString().substring(0, 10)}.log`
        download({filename, content})
        sendNotify({ title: '下载成功', message: '你的字幕记录已保存。' })
    }).catch(err => {
        sendNotify({ title: '下载失敗', message: err.message })
    })
}

async function clearLogs(record = false) {
    console.debug('deleting log...')
    const hasJimaku = record ? (await listRecords()).length > 0 : $('div#subtitle-list > p').length > 0
    if (!hasJimaku) {
        sendNotify({ title: '刪除失敗', message: '此房间没有任何字幕记录。' })
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
let lastFull = false
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
        if (lastFull) return
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

    lastFull = check
    console.debug('fullscreen is now ' + check)
}

// launch jimaku
export async function launchJimakuInspect(settings, { buttonOnly, liveTime }) {

    live_time = liveTime
    
    const { backgroundColor: bgc, subtitleColor: stc, backgroundHeight: bgh } = settings

    $('div#button-list').append(`
        <button id="clear-record" class="button">删除所有字幕记录</button>
    `)
    if (settings.record) {
        $('div#button-list').append('<button id="download-record" class="button">下载字幕记录</button>')
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
        div#subtitle-list p {
            animation: ${settings.jimakuAnimation} .3s ease-out;
            font-weight: bold;
            color: ${settings.subtitleColor}; 
            opacity: 1.0; 
            margin: ${settings.lineGap}px;
            font-size: ${settings.subtitleSize}px;  
        }
        </style>
    `)
    $('div#aside-area-vm').css('margin-bottom', `${bgh + 30}px`)

    // 屏幕彈幕監控
    launchDanmakuStyleChanger(settings)

    const previousRecord = await new Promise((res,) => listRecords().then(res).catch(() => res([])))
    for (const rec of previousRecord) {
        appendSubtitle(rec.text)
    }

    // WebSocket 监控
    wsMonitor(settings)

    // 全屏切換監控
    new Observer((mu, ) => {
        const currentState = $(mu[0].target).attr('data-player-state')
        if (currentState === lastState) return
        const fullScreen = currentState === 'web-fullscreen' || currentState === 'fullscreen'
        fullScreenTrigger(fullScreen, settings)
        lastState = currentState
    }).observe($('.bilibili-live-player.relative')[0], { attributes: true })
}