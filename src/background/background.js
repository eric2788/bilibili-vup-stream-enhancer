import getSettings from '../options/utils'

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
}


hookColor('color-jimaku')
hookColor('background-jimaku')
hookColor('color-subtitle')


assignValue().catch(console.error)

$('#save-settings').on('click', e => {
    if($('form#setting')[0].checkValidity()){
        e.preventDefault()
        console.log('prepare to save:')
        const set = getCurrentInput()
        console.log(set)
        browser.storage.sync.set(set).then(() => sendNotify({title: '设置成功', message: '你的设定已成功保存。'}))
    } 
})

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

function hookColor(from){
    $(`#${from}-picker`).on('change', e => {
        $(`#${from}`)[0].value = e.target.value
    })
}


async function sendNotify({title, message}){
    console.log('sending notification')
    return browser.notifications.create({
        type: 'basic',
        title,
        message
    })
}

browser.runtime.onMessage.addListener(sendNotify)
