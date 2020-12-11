import {getSettings, setSettings, sendNotify} from '../js/messaging'

function getCurrentInput(){
    const setting = {}
    setting.regex = $('#reg-cap')[0].value
    setting.opacity = $('#opacity-jimaku')[0].valueAsNumber
    setting.color = $('#color-jimaku')[0].value
    setting.hideJimakuDanmaku = $('#hide-jimaku-danmaku').prop('checked')
    setting.record = $('#enable-record').prop('checked')
    setting.vtbOnly = $('#vtb-only').prop('checked')
    setting.backgroundSubtitleOpacity = $('#opacity-background')[0].valueAsNumber
    setting.backgroundColor = $('#background-jimaku')[0].value
    setting.subtitleColor = $('#color-subtitle')[0].value
    const rooms = new Set()
    $('ul#blacklist').children('li').each((i, e)=>{
        const room = $(e).attr('room')
        rooms.add(room)
    })
    setting.blacklistRooms = [...rooms]

    setting.lineGap = $('#line-gap')[0].valueAsNumber
    setting.subtitleSize = $('#subtitle-size')[0].valueAsNumber
    setting.useWebSocket = $('#use-web-socket').prop('checked')
    setting.webSocketSettings = {
        danmakuPosition: $('#danmaku-position')[0].value
    }
    setting.useStreamingTime = $('#use-streaming-time').prop('checked')
    setting.useAsWhitelist = $('#use-whitelist').prop('checked')

    setting.backgroundHeight = $('#height-background')[0].valueAsNumber

    setting.buttonSettings = {
        backgroundListColor: $('#color-button-list-background')[0].value,
        backgroundColor: $('#color-button-background')[0].value,
        textColor: $('#color-button-text')[0].value
    }

    setting.filterCNV = $('#no-cn-v').prop('checked')
    return setting
}

function appendBlackList(room){
    $('ul#blacklist').prepend(`<li class="list-group-item" room="${room}">
            <span>${room}</span>
            <a style="float: right" href="javascript: void(0)" id="${room}">刪除</a>
    </li>`)
    $(`a#${room}`).on('click', e => {
        $('ul#blacklist').children('li').filter((i, e) => $(e).attr('room') == room).each((i, e) => e.remove())
    })
}

function saveCurrentInput(setting){
    $('#reg-cap')[0].value = setting.regex
    $('#opacity-jimaku')[0].valueAsNumber = setting.opacity

    $('#color-jimaku')[0].value = setting.color
    $('#color-jimaku-picker')[0].value = setting.color

    $('#hide-jimaku-danmaku').prop('checked', setting.hideJimakuDanmaku)
    $('#enable-record').prop('checked', setting.record)
    $('#vtb-only').prop('checked', setting.vtbOnly)

    $('#opacity-background')[0].valueAsNumber = setting.backgroundSubtitleOpacity

    $('#background-jimaku')[0].value = setting.backgroundColor
    $('#background-jimaku-picker')[0].value = setting.backgroundColor

    $('#color-subtitle')[0].value = setting.subtitleColor
    $('#color-subtitle-picker')[0].value = setting.subtitleColor

    $('#line-gap')[0].valueAsNumber = setting.lineGap

    $('#subtitle-size')[0].valueAsNumber = setting.subtitleSize

    for (const room of (setting.blacklistRooms ?? [])){
        appendBlackList(room)
    }

    $('#use-web-socket').prop('checked', setting.useWebSocket)
    $('#danmaku-position')[0].value = setting.webSocketSettings.danmakuPosition
    $('#danmaku-position').attr('disabled', !setting.useWebSocket)
    $('#use-streaming-time').prop('checked', setting.useStreamingTime)
    $('label[for=use-streaming-time]')[0].innerText = setting.useStreamingTime ? '使用串流时间戳记' : '使用真实时间戳记'

    $('#use-whitelist').prop('checked', setting.useAsWhitelist)

    $('#height-background')[0].valueAsNumber = setting.backgroundHeight

    const { backgroundListColor, backgroundColor, textColor } = setting.buttonSettings

    $('#color-button-list-background')[0].value = backgroundListColor
    $('#color-button-list-background-picker')[0].value = backgroundListColor

    $('#color-button-background')[0].value = backgroundColor
    $('#color-button-background-picker')[0].value = backgroundColor

    $('#color-button-text')[0].value = textColor
    $('#color-button-text-picker')[0].value = textColor

    $('#no-cn-v').prop('checked', setting.filterCNV)
}



hookColor('color-jimaku')
hookColor('background-jimaku')
hookColor('color-subtitle')
hookColor('color-button-list-background')
hookColor('color-button-background')
hookColor('color-button-text')




$('#save-settings').on('click', e => {
    const form = $('form#setting')
    if(form[0].checkValidity()){
        e.preventDefault()
        console.log('prepare to save:')
        const set = getCurrentInput()
        console.log(set)
        setSettings(set).then(() => {
            if (!sendNotify({title: '设置成功', message: '你的设定已成功保存。'})){
                window.alert('你的设定已成功保存。')
            }
        }).catch(err => {
            console.error(err)
            if (!sendNotify({title: '设置失敗', message: err.message})){
                window.alert(err.message)
            }
        })
    }else{
        console.log(form.find(":invalid"))
        form.find(":invalid").parents('.collapse').collapse('show')
        if (!sendNotify({title: '设置失败', message: '请检查是否有缺漏或格式错误。'})){
            window.alert('请检查是否有缺漏或格式错误。')
        }
    }
})


$('#clear-data').on('click', e =>{
    e.preventDefault()
    processDelete().catch(console.error)
})
const url = browser.runtime.getURL("")


window.addEventListener('message', e => {
    console.log('received message from: '+e.origin)
    console.log(e.data)
}, false)

async function processDelete(){
    if(window.confirm('决定删除所有直播房间的字幕记录?')){
        const tabs = await browser.tabs.query({url: '*://live.bilibili.com/*'})
        if (tabs.length > 0){
            await sendNotify({
                title: '删除失败',
                message: '检测到你有直播房间分页未关闭，请先关闭所有直播房间分页'
            })
        }else{
            const tab = await browser.tabs.create({
                active: false,
                url: 'https://live.bilibili.com'
            })
            
            await browser.tabs.executeScript(tab.id, {
                code: `
                    for (const db of Object.keys(localStorage).filter(s => s.startsWith('live_room'))){
                        window.indexedDB.deleteDatabase(db)
                    }
                    true
                `
            })
            await browser.tabs.remove(tab.id)
            await sendNotify({
                title: '删除成功',
                message: '资料库已被清空。'
            })
        }
    }
}


$('#blacklist-add-btn').on('click', e => {
    console.log('blacklist button')
    e.preventDefault()
    if (!$('#add-blacklist')[0].checkValidity()){
        return
    }
    const room = $('#add-blacklist')[0].value
    if (room === undefined || room === '') return
    appendBlackList(room)
    $('#add-blacklist')[0].value = ''
})

$('#use-web-socket').on('change', e => {
    const checked =  $(e.target).prop('checked')
    $('#danmaku-position').attr('disabled', !checked)
    if (!checked){
        $('#danmaku-position')[0].value = 'normal'
    }
})

$('#use-streaming-time').on('change', e => {
    const s = $(e.target).prop('checked')
    $('label[for=use-streaming-time]')[0].innerText = s ? '使用串流时间戳记' : '使用真实时间戳记'
  })

function hookColor(from){
    $(`#${from}-picker`).on('change', e => {
        $(`#${from}`)[0].value = e.target.value
    })
}


async function assignValue(){
    const setting = await getSettings()
    console.log(setting)
    saveCurrentInput(setting)
}


assignValue().catch(console.error)