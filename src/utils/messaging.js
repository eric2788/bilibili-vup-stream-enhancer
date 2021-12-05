export async function getSettings(){
    return sendData({type: 'get-settings'})
}

export async function sendNotify(data){
    return sendData({type: 'notify', data})
}

export async function setSettings(data){
    return sendData({type: 'save-settings', data})
}

export async function webRequest(url){
    return sendData({type: 'request', url})
}

export async function getBeforeSuperChat(){
    return sendData({type: 'before-sc'})
}

export async function checkUpdate(){
    return sendData({type: 'check-update'})
}

export async function openInspectWindow(roomId, title){
    return sendData({type: 'open-window', roomId, title})
}

export async function sendBackgroundJimaku(data){
    return sendData({type: 'jimaku', data})
}

export async function fetchDeveloper(){
    return sendData({type: 'fetch-developer'})
}

async function sendData(message){
    return browser.runtime.sendMessage(message)
}

