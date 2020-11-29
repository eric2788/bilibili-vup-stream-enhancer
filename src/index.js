import getSettings from './options/utils'

console.log('this page is using bilibili jimaku filter')

const list = document.getElementById('chat-items')

const config = { attributes: false, childList: true, subtree: true };

const subtitles = []

const roomReg = /^\/(?<id>\d+)/g
const roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)

const callback = async function(mutationsList, settings) {
    for(const mu of mutationsList){
        if (mu.addedNodes.length < 1) continue
        const danmaku = $(mu.addedNodes[0]).attr('data-danmaku').trim()
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
                    localStorage.setItem('record', JSON.stringify(subtitles))
                }
                if (settings.hideJimakuDanmaku){
                    await hide(danmaku)
                } else if (settings.opacity > -1 || settings.color.length > 0){
                    await hightlight(danmaku, {
                        opacity: settings.opacity > -1 ? Math.round(settings.opacity / 100) : -1,
                        color: settings.color.length > 0 ? settings.color : undefined
                    })
                }
            }
        }
    }
}

function appendSubtitle(subtitle){
    $('div#subtitle-list').prepend(`<h2 style="color: white">${subtitle}</h2>`)
}

async function hightlight(danmaku, {opacity, color} = {opacity: 1.0, color: undefined}){
    $('div.bilibili-danmaku').filter((i, e) => e.innerText.trim() === danmaku.trim()).each((i, e) => {
        if (opacity !== -1){
            $(e).css('opacity', opacity)
        }
        if (color !== undefined){
            $(e).css('color', color)
        }
    })
}

async function hide(danmaku){
    $('div.bilibili-danmaku').filter((i, e) => e.innerText.trim() === danmaku.trim()).remove()
}

async function process(){
    const settings = await getSettings()
    if (settings.vtbOnly){
        console.log('啟用僅限虛擬主播。')
        if (isNaN(roomId)) {
            console.log('未知直播房間')
            return
        }
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
        </style>
    `)
    if (settings.record){
        console.log('啟用同傳彈幕記錄')
        $('#button-list').append('<button id="download-record" class="button">下載字幕並刪除所有記錄</button>')
        $('button#download-record').on('click', downloadLog)
    }
    const previousRecord = getLocalRecord()
    for (const rec of previousRecord){
        subtitles.push(rec)
        appendSubtitle(rec.text)
    }
    const Observer = window.MutationObserver || window.MozMutationObserver
    const observer = new Observer((mlist, obs) => {
        callback(mlist, settings).catch(console.warn)
    });
    observer.observe(list, config);
}

function getLocalRecord(){
    try {
        return JSON.parse(localStorage.getItem('record') || '[]')
    }catch(err){
        console.warn(err.message)
        return []
    }
}

function downloadLog() {
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
    localStorage.removeItem('record')
    $('div#subtitle-list > h2').remove()
    browser.runtime.sendMessage({title: '下載成功', message: '你的字幕記錄已保存。'})
}

async function sleep(ms){
    return new Promise((res, )=> setTimeout(res, ms))
}
process().catch(err => console.warn(err.message))