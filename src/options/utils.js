const defaultSettings = {
    regex: '^(?<n>.+?)?【(?<cc>.+?)】*$',
    opacity: -1,
    color: '',
    hideJimakuDanmaku: false,
    vtbOnly: true,
    record: false,
    backgroundSubtitleOpacity: 40,
    backgroundColor: '#808080',
    subtitleColor: '#FFFFFF',
    blacklistRooms: [],
    useAsWhitelist: false,
    subtitleSize: 16,
    lineGap: 0,
    useWebSocket: false,
    webSocketSettings: {
        danmakuPosition: 'normal'
    },
    useStreamingTime: false
}

async function getSettings(){
    const res = await browser.storage.sync.get()
    return {...defaultSettings, ...res}
}

export default getSettings
