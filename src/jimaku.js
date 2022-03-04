import { pushRecord, listRecords, clearRecords, closeDatabase } from './utils/database'
import { sendNotify, openInspectWindow, sendBackgroundJimaku, setSettings } from './utils/messaging'
import { toTimer, logSettings, roomId, download, isTheme } from './utils/misc'
import ws from './utils/ws-listener';

const config = { attributes: false, childList: true, subtree: true };

const beforeInsert = []

const Observer = window.MutationObserver

const observers = []

function appendSubtitle(subtitle, uid = 0) {
    const ts = Date.now()
    $('div#subtitle-list').prepend(`<p id="subtitle-${ts}">${subtitle}</p>`)
    if (uid == 0) return
    $(`p#subtitle-${ts}`).on('contextmenu', e => {
        e.preventDefault()
        const {clientX: mouseX, clientY: mouseY} = e
        $('#ct-menu').css({
            top: `${mouseY}px`,
            left: `${mouseX}px`
        })

        $('#block-tc-user').attr('selecting', `${uid}`)
        $('#ct-menu').show()
    })
}

$(document.body).on('click', e => {
    if (e.target.offsetParent.id !== 'ct-menu') {
        $('#ct-menu').hide()
    }
})

$(document.body).append(`
    <div id="ct-menu">
        <div class="ct-item" id="block-tc-user">屏蔽选中同传发送者</div>
    </div>
    <style>
        #ct-menu{
            position: fixed;
            z-index: 10000;
            background: #1b1a1a;
            border-radius: 5px;
            display: none;
        }
        .ct-item{
            padding: 8px 15px;
            font-size: 12px;
            color: #dbdbdb;
            cursor: pointer;
            border-radius: inherit;
        }
        .ct-item:hover{
            color: #fff;
        }
        #ct-menu.visible {
            display: block;
        }
    </style>
`)


function getTimeStamp() {
    return new Date().toTimeString().substring(0, 8)
}

let live_time = undefined

function getStreamingTime() {
    try {
        if (!live_time) {
            throw new Error(`找不到開播時間`)
        }
        return toTimer(Math.round(Date.now() / 1000) - live_time)
    } catch (err) {
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


function chatMonitor(settings) {
    const { attr: attribute, elements } = settings.developer
    const callback = function (mutationsList) {
        for (const mu of mutationsList) {
            for (const node of mu.addedNodes) {
                const danmaku = $(node)?.attr(attribute.chatDanmaku)?.trim()
                const userId = $(node)?.attr(attribute.chatUserId)?.trim()
                const isTongChuan = settings.tongchuanMans.includes(`${userId}`)
                // 在同传黑名单内
                if (settings.tongchuanBlackList.includes(`${userId}`)) {
                    console.log(`用户 ${userId} 在同传黑名单内, 已略过。`)
                    continue
                }
                if (danmaku) {
                    const id = `${danmaku}-${userId}`
                    if (beforeInsert.pop() === id) continue
                    console.debug(`[BJF] ${danmaku}`)
                    beforeInsert.push(id)
                }
                let subtitle = toJimaku(danmaku, settings.regex)
                if (!subtitle && isTongChuan) subtitle = danmaku
                if (subtitle !== undefined) {
                    if (beforeInsert.shift() === subtitle) {
                        continue
                    }
                    pushSubtitle(subtitle, userId)
                }
            }
        }
    }
    const observer = new Observer((mlist,) => callback(mlist));
    observer.observe($(elements.chatItems)[0], config);
    observers.push(observer)
}


function danmakuCheckCallback(mutationsList, settings, { hideJimakuDisable, opacityDisable }) {
    for (const mu of mutationsList) {
        for (const node of mu.addedNodes) {
            const danmaku = node?.innerText?.trim() ?? node?.data?.trim()
            if (toJimaku(danmaku, settings.regex) !== undefined) {
                const n = node.innerText !== undefined ? node : node.parentElement
                const jimaku = $(n)
                if (!hideJimakuDisable) {
                    jimaku.css('display', 'none')
                    jimaku.css('visibility', 'hidden')
                    return
                }
                if (!opacityDisable) {
                    const o = (settings.opacity / 100).toFixed(1)
                    jimaku.css('opacity', o)
                }
                // 非 Websocket 方式需要从這裏改颜色
                if (settings.useLegacy) {
                    jimaku.css('color', settings.color)
                }
            }
        }
    }
}

function launchBottomInterval(elements) {
    return setInterval(() => {
        const btn = $(elements.newMsgButton)
        if (btn.css('display') !== 'none') {
            btn.trigger('click')
        }
    }, 1000)
}

function launchDanmakuStyleChanger(settings) {
    const opacityDisable = settings.opacity == -1
    const hideJimakuDisable = !settings.hideJimakuDanmaku
    if (opacityDisable && hideJimakuDisable && !(settings.useLegacy && /^#[0-9A-F]{6}$/ig.test(settings.color))) return
    const danmakuObserver = new Observer((mu,) => danmakuCheckCallback(mu, settings, { hideJimakuDisable, opacityDisable }))
    danmakuObserver.observe($(settings.developer.elements.danmakuArea)[0], config)
    observers.push(danmakuObserver)
}


const SUBTITLE_TRANSACTIONS = []
let subtitleInterval = -1

function pushSubtitle(subtitle, uid) {
    SUBTITLE_TRANSACTIONS.push({subtitle, uid})
}

function launchSubtitleInterval(settings) {
    subtitleInterval = setInterval(() => {
        const {subtitle, uid} = SUBTITLE_TRANSACTIONS.shift()
        if (!subtitle) return
        appendSubtitle(subtitle, uid)
        const date = settings.useStreamingTime ? getStreamingTime() : getTimeStamp()
        if (settings.record) {
            pushRecord({ date, text: subtitle })
                .then(() => {
                    logSettings.hasLog = true
                    logSettings.changed = true
                })
                .catch(console.warn)
        }
        sendBackgroundJimaku({ room: roomId, date, text: subtitle }).catch(console.error)
    }, 300)
}


function wsMonitor(settings) {
    const { danmakuPosition } = settings.webSocketSettings
    ws.addHandler('DANMU_MSG', command => {
        const userId = command.info[2][0]
        const danmaku = command.info[1]
        const ul = command.info[4][0]

        // 在同传黑名单内
        if (settings.tongchuanBlackList.includes(`${userId}`)) {
            console.log(`用户 ${userId} 在同传黑名单内, 已略过。`)
            return
        }

        if (danmaku) {
            const id = `${danmaku}-${userId}`
            if (beforeInsert.pop() === id) return
            console.debug(`[BJF] ${danmaku} (${userId} | UL. ${ul})`)
            beforeInsert.push(id)
        }
        const isTongChuan = settings.tongchuanMans.includes(`${userId}`)
        if (ul < settings.filterLevel && !isTongChuan) return
        let jimaku = toJimaku(danmaku, settings.regex)
        if (!jimaku && isTongChuan) jimaku = danmaku
        if (jimaku) {
            pushSubtitle(jimaku, userId)
            if (/^#[0-9A-F]{6}$/ig.test(settings.color)) {
                command.info[0][3] = parseInt(settings.color.substr(1), 16)
            }
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
        download({ filename, content })
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
    const cfg = { disabled: !check && !isTheme }
    element.draggable(cfg)
    element.resizable(cfg)

    if (!check && !isTheme) {
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

        $(settings.developer.elements.jimakuFullArea).after(element)

    }

    lastFull = check
    console.debug('fullscreen is now ' + check)
}

// launch jimaku
export async function launchJimakuInspect(settings, { buttonOnly, liveTime, enabledRecord }) {

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

    const { elements, classes } = settings.developer

    if (settings.enableJimakuPopup) {
        $('#button-list').append(`
            <button class="button" id="launch-bg">弹出同传视窗</button>
        `)
        $('#launch-bg').on('click', async () => {
            try {
                const title = $(elements.liveTitle)[0]?.innerText ?? 'null'
                await openInspectWindow(roomId, title)
                await sendNotify({
                    title: '启动成功',
                    message: '已打开新的同传弹幕视窗。'
                })
            } catch (err) {
                console.error(err)
                await sendNotify({
                    title: '启动同传弹幕视窗失败',
                    message: err?.message ?? err
                })
            }
        })
    }

    $(elements.jimakuArea).after(`
        <div id="subtitle-list" class="subtitle-normal">
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
            div#subtitle-list p:first-child {
                font-size: ${settings.firstSubtitleSize}px;
            }
            div#subtitle-list p {
                animation: ${settings.jimakuAnimation} .3s ease-out;
                font-weight: bold;
                color: ${settings.subtitleColor}; 
                opacity: 1.0; 
                margin: ${settings.lineGap}px;
                font-size: ${settings.subtitleSize}px;  
            }
            /* create context menu for each subtitle element */
            div#subtitle-list p:not(:first-child) {
                cursor: context-menu;
            }
            </style>
        </div>
    `)


    // 屏幕彈幕監控
    launchDanmakuStyleChanger(settings)
    if (subtitleInterval > 0) clearInterval(subtitleInterval)
    launchSubtitleInterval(settings)

    const previousRecord = await new Promise((res,) => listRecords().then(res).catch(() => res([])))
    for (const rec of previousRecord) {
        appendSubtitle(rec.text)
    }

    if (settings.useLegacy) {
        // 传统捕捉元素方式
        chatMonitor(settings)

        $('#button-list').append(`
            <div class="button">
                <input type="checkbox" id="keep-bottom">
                <label for="keep-bottom">保持聊天栏最底(否则字幕无法出现)</label><br>
            </div>
        `)

        let bottomInterval = -1
        $('input#keep-bottom').on('click', e => {
            const checked = $(e.target).prop('checked')
            if (checked) {
                bottomInterval = launchBottomInterval(elements)
            } else {
                clearInterval(bottomInterval)
            }
        })

    } else {
        // WebSocket 监控
        wsMonitor(settings)
    }

    if (isTheme) {
        lastFull = false
        fullScreenTrigger(true, settings) // 先設置全屏
    } else {
        $(elements.videoArea).css('margin-bottom', `${bgh + 30}px`)
        // 全屏切換監控
        const monObserver = new Observer((mu,) => {
            const currentState = $(mu[0].target).hasClass(classes.screenWeb) ? 'web-fullscreen' : $(mu[0].target).hasClass(classes.screenFull) ? 'fullscreen' : 'normal'
            if (currentState === lastState) return
            const fullScreen = currentState === 'web-fullscreen' || currentState === 'fullscreen'
            fullScreenTrigger(fullScreen, settings)
            lastState = currentState
        })
        monObserver.observe(document.body, { attributes: true, subtree: false, childList: false })
        observers.push(monObserver)
    }

    $('#block-tc-user').off('click')
    $('#block-tc-user').on('click', async e => {
        e.preventDefault()
        $('#ct-menu').hide()
        const uid = $(e.target).attr('selecting')
        if (uid === undefined) {
            console.warn('没有选中的同传发送者，已略过。')
            return
        }
        try {
            if (!window.confirm(`确定屏蔽同传用户ID (${uid}) ?`)) return
            settings.tongchuanBlackList.push(uid)
            if (enabledRecord) {
                settings.record = true // revert the setting before save
            }
            await setSettings(settings)
            await sendNotify({
                title: "屏蔽成功",
                message: `已成功添加用户 ${uid} 到同传黑名单。`
            })
        } catch (err) {
            await sendNotify({
                title: '添加失败',
                message: err?.message ?? err
            })
        }
        $(e.target).removeAttr('selecting')
    })
}






export function cancelJimakuFunction() {
    $('#subtitle-list').remove()
    $('div#aside-area-vm').css('margin-bottom', '')
    while (observers.length > 0) {
        observers.shift().disconnect()
    }
    ws.clearHandlers('DANMU_MSG')
    closeDatabase()
}