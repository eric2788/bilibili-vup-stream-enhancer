import getSettings from './options/utils'

const list = document.getElementById('chat-items')
const danmakuScreen = document.getElementsByClassName('bilibili-live-player-video-danmaku')[0]

const config = { attributes: false, childList: true, subtree: true };

let subtitles = []
const danmakuTargets = new Set()

const roomReg = /^\/(?<id>\d+)/g
const roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)

const colorReg = /^#[0-9A-F]{6}$/ig

if (isNaN(roomId)){
    throw new Error('未知直播房間。')
}

let bottomInterval = -1

const key = `jimaku.${roomId}`

const Observer = window.MutationObserver || window.MozMutationObserver

const callback = async function(mutationsList, settings) {
    for(const mu of mutationsList){
        if (mu.addedNodes.length < 1) continue
        for (const node of mu.addedNodes){
            const danmaku = $(node)?.attr('data-danmaku')?.trim()
            if(danmaku !== undefined){
                console.debug(danmaku)
                const reg = new RegExp(settings.regex)
                const subtitle = reg.exec(danmaku)?.groups?.cc
                if (subtitle !== undefined && subtitle !== ""){
                    appendSubtitle(subtitle)
                    if (settings.record){
                        subtitles.push({
                            date: new Date(),
                            text: subtitle
                        })
                        localStorage.setItem(key, JSON.stringify(subtitles))
                    }
                    if (settings.hideJimakuDanmaku || colorReg.test(settings.color) || settings.opacity > -1){
                       danmakuTargets.add(danmaku)
                    }
                }
            }
        }
    }
}

function appendSubtitle(subtitle){
    $('div#subtitle-list').prepend(`<h2 style="color: white">${subtitle}</h2>`)
}

function hightlight(danmaku, {opacity, color} = {opacity: 1.0, color: undefined}){
    $('div.bilibili-danmaku').filter((i, e) => e.innerText.trim() === danmaku.trim()).each((i, e) => {
        if (opacity !== -1){
            $(e).css('opacity', opacity)
        }
        if (color !== undefined){
            $(e).css('color', color)
        }
    })
}

function hide(danmaku){
    $('div.bilibili-danmaku').filter((i, e) => e.innerText.trim() === danmaku.trim()).remove()
}

function launchBottomInterval(){
    return setInterval(() => {
        const btn = $('div#danmaku-buffer-prompt')
        if (btn.css('display') !== 'none'){
            btn.trigger('click')
        }
    }, 1000)
}

async function danmakuCheckCallback(mutationsList, settings, {hideJimakuDisable, opacityDisable, colorDisable}){
    for(const mu of mutationsList){
        if (mu.addedNodes.length < 1) continue
        for (const node of mu.addedNodes){
            const danmaku = node?.innerText?.trim() ?? node?.data?.trim()
            if(danmaku !== undefined){
                const reg = new RegExp(settings.regex)
                const subtitle = reg.exec(danmaku)?.groups?.cc
                if (subtitle !== undefined && subtitle !== ""){
                    const n = node.innerText !== undefined ? node : node.parentElement
                    const jimaku = $(n)
                    if (!hideJimakuDisable){
                        jimaku.css('display', 'none')
                        return  
                    }
                    if (!opacityDisable){
                        const o = Math.round(settings.opacity / 100)
                        jimaku.css('opacity', o)
                    }
                    if (!colorDisable){
                        jimaku.css('color', settings.color)
                    }
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
    danmakuObserver.observe(danmakuScreen, config)
}

// start
async function process() {
    console.log('this page is using bilibili jimaku filter')
    const settings = await getSettings()
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
        <div id="subtitle-list" style="background-color: gray; width: 100%; height: 100px; position: relative ;z-index: 3;overflow-y: auto; text-align: center">
        </div>
        <div id="button-list" style="text-align: center; background-color: white">
            <button id="clear-record" class="button">刪除所有字幕記錄</button>
        </div>
        <style>
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
        $('#button-list').append('<button id="download-record" class="button">下載字幕記錄</button>')
        $('button#download-record').on('click', downloadLog)
    }
    $('button#clear-record').on('click', clearRecords)
    $('#button-list').append(`
        <input type="checkbox" id="keep-bottom" value="Bike">
        <label for="keep-bottom">保持聊天欄最底(否則字幕無法出現)</label><br>
    `)
    $('input#keep-bottom').on('click', e =>{
        const checked = $(e.target).prop('checked')
        if (checked){
            bottomInterval = launchBottomInterval()
        }else{
            clearInterval(bottomInterval)
        }
    })
    launchDanmakuStyleChanger(settings)
    const previousRecord = getLocalRecord()
    for (const rec of previousRecord){
        subtitles.push(rec)
        appendSubtitle(rec.text)
    }
    const observer = new Observer((mlist, obs) => callback(mlist, settings).catch(console.warn));
    observer.observe(list, config);
}

function getLocalRecord(){
    try {
        return JSON.parse(localStorage.getItem(key) || '[]')
    }catch(err){
        console.warn(err.message)
        return []
    }
}

function downloadLog() {
    console.debug('downloading log...')
    const st = getLocalRecord()
    if (st.length == 0){
        browser.runtime.sendMessage({title: '下載失敗', message: '字幕記錄為空。'})
        return
    }
    const a = document.createElement("a");
    const file = new Blob([st.map(s => `[${new Date(s.date).toTimeString().substring(0, 8)}] ${s.text}`).join('\n')], {type: 'text/plain'});
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `subtitles-${roomId}-${new Date().toISOString().substring(0, 10)}.log`
    a.click();
    URL.revokeObjectURL(url)
    browser.runtime.sendMessage({title: '下載成功', message: '你的字幕記錄已保存。'})
}

function clearRecords(){
    console.debug('deleting log...')
    const st = $('div#subtitle-list > h2')
    if (st.length == 0){
        browser.runtime.sendMessage({title: '刪除失敗', message: '字幕記錄為空。'})
        return
    }
    subtitles = []
    localStorage.removeItem(key)
    $('div#subtitle-list > h2').remove()
    browser.runtime.sendMessage({title: '刪除成功', message: '此直播房間的字幕記錄已被清空。'})
}

function draggable(element, check){
    element.draggable({
        disabled: !check,
        revert: !check
    })
      
      if (!check) {
        element.css({
          'top': '0',
          'bottom': '0',
          'right': '0',
          'left': '0'
        })
      }
}

async function sleep(ms){
    return new Promise((res, )=> setTimeout(res, ms))
}


process().catch(console.error)