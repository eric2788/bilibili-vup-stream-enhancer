import getSettings, { isFirefox } from '../options/utils'

console.log('background is working...')

browser.browserAction.onClicked.addListener((tab, clickData) => {
    browser.tabs.create({
        url: browser.runtime.getURL('background.html')
    })
})

async function assignValue(){
    const setting = await getSettings()
    console.log(setting)
    saveCurrentInput(setting)
}

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
}



hookColor('color-jimaku')
hookColor('background-jimaku')
hookColor('color-subtitle')
hookColor('color-button-list-background')
hookColor('color-button-background')
hookColor('color-button-text')


assignValue().catch(console.error)

$('#save-settings').on('click', e => {
    const form = $('form#setting')
    if(form[0].checkValidity()){
        e.preventDefault()
        console.log('prepare to save:')
        const set = getCurrentInput()
        console.log(set)
        browser.storage.sync.set(set).then(() => {
            if (!sendNotify({title: '设置成功', message: '你的设定已成功保存。'})){
                window.alert('你的设定已成功保存。')
            }
        }).catch(console.error)
    }else{
        console.log(form.find(":invalid"))
        form.find(":invalid").parents('.collapse').collapse('show')
        if (!sendNotify({title: '设置失败', message: '请检查是否有缺漏或格式错误。'})){
            window.alert('请检查是否有缺漏或格式错误。')
        }
    }
})

if (!isFirefox){
    $('label[for=vtb-only]').after(`<small id="vtb-only-help">(非火狐浏览器不建议开启此选项)</small>`)
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


async function sendNotify({title, message}){
    console.log('sending notification')
    return browser?.notifications?.create({
        type: 'basic',
        title,
        message,
        iconUrl: browser.runtime.getURL('icons/icon.png')
    }).catch(console.error)
}

browser.runtime.onMessage.addListener((message, {tab}) => {
    switch (message.type){
        case "notify":
            sendNotify(message.data)
            break;
        default:
            break;
    }
})