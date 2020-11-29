const defaultSettings = {
    regex: '^【(?<cc>.+)】$',
    opacity: -1,
    color: '',
    hideJimakuDanmaku: false,
    vtbOnly: true,
    record: false
}

async function getSettings(){
    const res = await browser.storage.local.get()
    return Object.keys(res).length == 0 ? defaultSettings : res
}

export default getSettings
