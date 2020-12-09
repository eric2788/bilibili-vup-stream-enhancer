export const isFirefox = typeof InstallTrigger !== 'undefined'

const defaultSettings = {
    regex: '^(?<n>[^【】]+?)?\:*\s*【(?<cc>[^【】]+?)】*$',
    opacity: -1,
    color: '',
    hideJimakuDanmaku: false,
    vtbOnly: isFirefox,
    record: false,

    backgroundSubtitleOpacity: 40,
    backgroundColor: '#808080',
    backgroundHeight: 100,

    subtitleColor: '#FFFFFF',
    blacklistRooms: [],
    useAsWhitelist: false,
    subtitleSize: 16,
    lineGap: 0,
    useWebSocket: false,
    webSocketSettings: {
        danmakuPosition: 'normal'
    },
    useStreamingTime: false,
    buttonSettings: {
        backgroundListColor: '#FFFFFF',
        backgroundColor: '#000000',
        textColor: '#FFFFFF'
    }
}

async function getSettings(){
    const res = await browser.storage.sync.get()
    return {...defaultSettings, ...res}
}

export default getSettings
