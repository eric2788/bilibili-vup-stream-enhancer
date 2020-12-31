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

export async function checkUpdate(){
    return sendData({type: 'check-update'})
}

async function sendData(message){
    return browser.runtime.sendMessage(message)
}
