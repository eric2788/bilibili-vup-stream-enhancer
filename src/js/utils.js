export const isFirefox = navigator.userAgent.indexOf('Firefox') > -1

export const isChrome = navigator.userAgent.indexOf('Chrome') > -1

export const isOpera = navigator.userAgent.indexOf("OP") > -1

export const isEdge = navigator.userAgent.indexOf("Edg") > -1

export const canUseButton = isChrome

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
    tongchuanMans: [],
    subtitleColor: '#FFFFFF',
    blacklistRooms: [],
    useAsWhitelist: false,
    subtitleSize: 16,
    lineGap: 10,
    useWebSocket: true,
    jimakuAnimation: 'top',
    webSocketSettings: {
        danmakuPosition: 'normal',
        forceAlterWay: false
    },
    useStreamingTime: false,
    buttonSettings: {
        backgroundListColor: '#FFFFFF',
        backgroundColor: '#000000',
        textColor: '#FFFFFF'
    },
    filterCNV: false,
    autoCheckUpdate: true
}

async function getSettings(){
    const res = await browser.storage.sync.get()
    return {...defaultSettings, ...res}
}

export default getSettings
