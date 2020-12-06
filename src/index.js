import getSettings from './options/utils'

const config = { attributes: false, childList: true, subtree: true };

// Injecting web socket inspector on start
const b = `
    <script src="${browser.runtime.getURL('cdn/pako.min.js')}"></script>
    <script src="${browser.runtime.getURL('cdn/blive-proxy.js')}"></script>
`
$(document.head).append(b)

// for reassign
//let $$$ = $

let subtitles = []

const beforeInsert = []

const roomReg = /^\/(?<id>\d+)/g
const roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)

const colorReg = /^#[0-9A-F]{6}$/ig

if (isNaN(roomId)){
    throw new Error('未知直播房間。')
}

let bottomInterval = -1

const key = `jimaku.${roomId}`

const Observer = window.MutationObserver || window.MozMutationObserver



function appendSubtitle(subtitle, settings){
    $('div#subtitle-list').prepend(`<h2 style="
    color: ${settings.subtitleColor}; 
    opacity: 1.0; 
    margin-bottom: ${settings.lineGap}px; 
    font-size: ${settings.subtitleSize}px
    ">${subtitle}</h2>`)
}

function launchBottomInterval(){
    return setInterval(() => {
        const btn = $('div#danmaku-buffer-prompt')
        if (btn.css('display') !== 'none'){
            btn.trigger('click')
        }
    }, 1000)
}

function getTimeStamp(){
    return new Date(s.date).toTimeString().substring(0, 8)
}

function getStreamingTime(){
    return $('[data-title=直播持续时间] > span')[0].innerText
}

function toJimaku(danmaku, regex){
    if(danmaku !== undefined){
        console.debug(danmaku)
        const reg = new RegExp(regex)
        const g = reg.exec(danmaku)?.groups
        danmaku = g?.cc
        const name = g?.n
        if (danmaku === ""){
            danmaku = undefined
        }
        return name && danmaku ? `${name}: ${danmaku}` : danmaku
    }
    return danmaku
}

async function danmakuCheckCallback(mutationsList, settings, {hideJimakuDisable, opacityDisable, colorDisable}){
    for(const mu of mutationsList){
        if (mu.addedNodes.length < 1) continue
        for (const node of mu.addedNodes){
            const danmaku = node?.innerText?.trim() ?? node?.data?.trim()
            if(toJimaku(danmaku, settings.regex) !== undefined){
                const n = node.innerText !== undefined ? node : node.parentElement
                const jimaku = $(n)
                if (!hideJimakuDisable){
                    jimaku.css('display', 'none')
                    return  
                }
                if (!opacityDisable){
                    const o = (settings.opacity / 100).toFixed(1)
                    jimaku.css('opacity', o)
                }
                if (!colorDisable){
                    jimaku.css('color', settings.color)
                }
            }
        }
    }
}

function launchDanmakuStyleChanger(settings){
    const opacityDisable = settings.opacity == -1
    const colorDisable = !colorReg.test(settings.color)
    const hideJimakuDisable = !settings.hideJimakuDanmaku
    if (opacityDisable && colorDisable && hideJimakuDisable) return
    const danmakuObserver = new Observer((mu, obs) => danmakuCheckCallback(mu, settings, {hideJimakuDisable, opacityDisable, colorDisable}).catch(console.warn))
    danmakuObserver.observe($('.bilibili-live-player-video-danmaku')[0], config)
}

// start
async function process() {
    console.log('this page is using bilibili jimaku filter')
    const roomLink =  $('a.room-owner-username').attr('href')
    if (!roomLink){
        console.log('the room is theme room, skipped')
        return
    }
    const settings = await getSettings()
    if (settings.blacklistRooms.includes(`${roomId}`)){
        console.log('房間ID在黑名單上，已略過。')
        return
    }
    if (settings.vtbOnly){
        console.log('啟用僅限虛擬主播。')
        try{
            const res = await fetch('https://vup.darkflame.ga/api/online')
            if (!res.ok) {
                throw new Error(`刷新 斗蟲數據 時 出現錯誤: ${res.status}`)
            } else {
                const data = await res.json()
                if (!data.list.some(y => y.shortId == roomId || y.roomId == roomId)){
                    console.warn('不是虛擬主播房間, 取消字幕過濾')
                    return
                }
            }
        }catch(err){
            console.warn(`索取資源時出現錯誤: ${err.message}`)
            console.warn('三秒後重新刷新')
            await sleep(3000)
            return await process()
        }
    }
    $('#gift-control-vm').before(`
        <div id="subtitle-list" class="subtitle-normal">
        </div>
        <div id="button-list" style="text-align: center; background-color: white">
            <button id="clear-record" class="button">删除所有字幕记录</button>
        </div>
        <style>
        .subtitle-normal {
            background-color: ${settings.backgroundColor}; 
            width: 100%; 
            height: 100px; 
            position: relative;
            z-index: 3;
            overflow-y: auto; 
            text-align: center;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: ${settings.subtitleColor} ${settings.backgroundColor};
        }
        .subtitle-normal::-webkit-scrollbar {
            width: 5px;
        }
         
        .subtitle-normal::-webkit-scrollbar-track {
            background-color: ${settings.backgroundColor};
        }
         
        .subtitle-normal::-webkit-scrollbar-thumb {
            background-color: ${settings.subtitleColor};
        }
        .button {
            background-color: black;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 15px;
            margin: 5px 5px;
            left: 50%;
            cursor: pointer;
          }
          .grid-container {
            display: inline-grid;
          }
          .grid-item {
            text-align: center;
          }
          @keyframes trans {
            from {
              transform: translateY(-30px);
              opacity: 0;
            }
          }
          div#subtitle-list h2 {
              animation: trans .3s ease-out;
          }
        </style>
    `)
    if (settings.record){
        console.log('啟用同傳彈幕記錄')
        $('#button-list').append('<button id="download-record" class="button">下载字幕记录</button>')
        $('button#download-record').on('click', downloadLog)
    }
    $('button#clear-record').on('click', clearRecords)
    if(!settings.useWebSocket){
        $('#button-list').append(`
            <input type="checkbox" id="keep-bottom">
            <label for="keep-bottom">保持聊天栏最底(否则字幕无法出现)</label><br>
        `)
    }
    $('input#keep-bottom').on('click', e =>{
        const checked = $(e.target).prop('checked')
        if (checked){
            bottomInterval = launchBottomInterval()
        }else{
            clearInterval(bottomInterval)
        }
    })

    // 屏幕彈幕監控
    launchDanmakuStyleChanger(settings)

    const previousRecord = getLocalRecord()
    for (const rec of previousRecord){
        subtitles.push(rec)
        appendSubtitle(rec.text, settings)
        if(!settings.useWebSocket) beforeInsert.push(rec.text)
    }

    if (settings.useWebSocket){
        // WebSocket 监控
        wsMonitor(settings)
    }else{
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
    }).observe($('.bilibili-live-player.relative')[0], {attributes: true})
}

function pushSubtitle(subtitle, settings){
    appendSubtitle(subtitle, settings)
    const date = settings.useStreamingTime ? getStreamingTime() : getTimeStamp()
    if (settings.record){
        subtitles.push({
            date,
            text: subtitle
        })
        localStorage.setItem(key, JSON.stringify(subtitles))
    }
}

function chatMonitor(settings){
    const callback = async function(mutationsList) {
        for(const mu of mutationsList){
            if (mu.addedNodes.length < 1) continue
            for (const node of mu.addedNodes){
                const danmaku = $(node)?.attr('data-danmaku')?.trim()
                const subtitle = toJimaku(danmaku, settings.regex)
                if(subtitle !== undefined){
                    if (beforeInsert.shift() === subtitle){
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

function wsMonitor(settings){
    /*
    const a = `
            <script>
                WebSocket.prototype._send = WebSocket.prototype.send;
                WebSocket.prototype.send = function(data) {
                    this._send(data);
                    this.addEventListener('message', function(msg) {
                        const event = new CustomEvent('ws:message', {detail: msg})
                        window.dispatchEvent(event)
                    },{ cature: true } true);
                    this.send = this._send
                }
                console.log('ws is injected')
            </script>
     `
     */
    window.addEventListener('ws:bilibili-live', ({detail: {cmd, command}}) => {
        if (cmd === 'DANMU_MSG'){
            const danmaku = command.info[1]
            const jimaku = toJimaku(danmaku, settings.regex)
            if (jimaku !== undefined){
                pushSubtitle(jimaku, settings)
                //在使用 websocket 的情况下，可以强制置顶和置底弹幕
                switch(settings.webSocketSettings.danmakuPosition){
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
}

let lastState = 'normal'

function getLocalRecord(){
    try {
        return JSON.parse(localStorage.getItem(key) || '[]')
    }catch(err){
        console.warn(err.message)
        return []
    }
}

function sendNotify(data){
    browser.runtime.sendMessage({type: 'notify', data}).catch(console.error)
}

function downloadLog() {
    console.debug('downloading log...')
    const st = getLocalRecord()
    if (st.length == 0){
        sendNotify({title: '下载失败', message: '字幕记录为空。'})
        return
    }
    const a = document.createElement("a");
    const file = new Blob([st.map(s => `[${s.date}] ${s.text}`).join('\n')], {type: 'text/plain'});
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `subtitles-${roomId}-${new Date().toISOString().substring(0, 10)}.log`
    a.click();
    URL.revokeObjectURL(url)
    sendNotify({title: '下载成功', message: '你的字幕记录已保存。'})
}

function clearRecords(){
    console.debug('deleting log...')
    const st = $('div#subtitle-list > h2')
    if (st.length == 0){
        sendNotify({title: '刪除失敗', message: '字幕记录为空。'})
        return
    }
    subtitles = []
    localStorage.removeItem(key)
    $('div#subtitle-list > h2').remove()
    sendNotify({title: '刪除成功', message: '此直播房间的字幕记录已被清空。'})
}

function toRgba(hex, opacity){
    let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+`,${opacity})`;
        }
        console.warn('bad Hex: '+hex);
        return hex
}

function fullScreenTrigger(check, settings){
    const element = $('div#subtitle-list')
    const cfg = {disabled: !check}
    element.draggable(cfg)
    element.resizable(cfg)
      
      if (!check) {
        element.removeAttr('style')
        $('div#button-list').before(element)
      }else{
          element.css({
            'z-index': '9',
            'cursor': 'move',
            'position': 'absolute',
            'bottom': '100px',
            'background-color': toRgba(settings.backgroundColor, (settings.backgroundSubtitleOpacity / 100).toFixed(1)),
            'width': '50%'
          })
          element.prependTo($('div.bilibili-live-player-video-area'))
      }

      console.debug('fullscreen is now '+check)
}

async function sleep(ms){
    return new Promise((res, )=> setTimeout(res, ms))
}


process().catch(console.error)