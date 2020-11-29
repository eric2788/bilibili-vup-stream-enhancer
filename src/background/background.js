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
    return setting
}

function saveCurrentInput(setting){
    $('#reg-cap')[0].value = setting.regex
    $('#opacity-jimaku')[0].valueAsNumber = setting.opacity
    $('#color-jimaku')[0].value = setting.color
    $('#hide-jimaku-danmaku').prop('checked', setting.hideJimakuDanmaku)
    $('#enable-record').prop('checked', setting.record)
    $('#vtb-only').prop('checked', setting.vtbOnly)
}


console.log(getCurrentInput())


assignValue().catch(console.error)

$('#save-settings').on('click', e => {
    if($('form#setting')[0].checkValidity()){
        e.preventDefault()
        console.log('prepare to save:')
        const set = getCurrentInput()
        console.log(set)
        browser.storage.local.set(set).then(() => sendNotify({title: '設置成功', message: '你的設定已成功保存。'}))
    } 
})

sendNotify({title: 'hello', message: 'hello world!!'})

async function sendNotify({title, message}){
    console.log('sending notification')
    return browser.notifications.create({
        type: 'basic',
        title,
        message
    })
}

browser.runtime.onMessage.addListener(sendNotify)
