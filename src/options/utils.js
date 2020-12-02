const defaultSettings = {
    regex: '^【(?<cc>.+?)】*$',
    opacity: -1,
    color: '',
    hideJimakuDanmaku: false,
    vtbOnly: true,
    record: false,
    backgroundSubtitleOpacity: 40,
    backgroundColor: '#808080',
    subtitleColor: '#FFFFFF',
    blacklistRooms: [],
    subtitleSize: 16,
    lineGap: 0
}

async function getSettings(){
    const res = await browser.storage.sync.get()
    return {...defaultSettings, ...res}
}

export default getSettings
