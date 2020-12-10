import getSettings from '../js/utils'

console.log('background is working...')

browser.browserAction.onClicked.addListener((tab, clickData) => {
    browser.tabs.create({
        url: browser.runtime.getURL('settings.html')
    })
})

async function sendNotify({title, message}){
    console.log('sending notification')
    return browser.notifications.create({
        type: 'basic',
        title,
        message,
        iconUrl: browser.runtime.getURL('icons/icon.png')
    }).catch(console.error)
}

async function webRequest(url){
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.statusText}(${res.status})`)
    const json = await res.json()
    return json
}

browser.runtime.onMessage.addListener((message, {tab}) => {
    console.log('received command: '+message.type)
    switch (message.type){
        case "notify":
            sendNotify(message.data)
            break;
        case "get-settings":
            return getSettings()
        case "save-settings":
            return browser.storage.sync.set(message.data)
        case "request":
            return webRequest(message.url)
        default:
            break;
    }
})