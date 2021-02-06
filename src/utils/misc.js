export const isFirefox = navigator.userAgent.indexOf('Firefox') > -1

export const isChrome = navigator.userAgent.indexOf('Chrome') > -1

export const isOpera = navigator.userAgent.indexOf("OP") > -1

export const isEdge = navigator.userAgent.indexOf("Edg") > -1

export const canUseButton = isChrome

const defaultSettings = {
    regex: '^(?<n>[^【】]+?)?\\:*\\s*【(?<cc>[^【】]+?)】*$',
    opacity: -1,
    color: '',
    hideJimakuDanmaku: false,
    vtbOnly: true,
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
    jimakuAnimation: 'top',
    webSocketSettings: {
        danmakuPosition: 'normal'
    },
    useStreamingTime: false,
    buttonSettings: {
        backgroundListColor: '#FFFFFF',
        backgroundColor: '#000000',
        textColor: '#FFFFFF'
    },
    filterCNV: false,
    autoCheckUpdate: true,
    recordSuperChat: false,
    enableRestart: false
}

async function getSettings(){
    const res = await browser.storage.sync.get()
    return {...defaultSettings, ...res}
}

export function getUserAgent(){
    if (isEdge){
        return "edge"
    }else if (isChrome){
        return "chrome"
    } else if (isFirefox){
        return "firefox"
    } else if (isOpera){
        return "opera"
    } else {
        return "not-supported"
    }
}

export function download({filename, content, type = 'text/plain'}){
    const a = document.createElement("a");
    const file = new Blob([content], { type });
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename
    a.click();
    URL.revokeObjectURL(url)
}

export function generateToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const themeRegex = /\/blackboard(\/live)?\/activity-(.+?)\.html/g

export const isTheme = themeRegex.test(location.pathname)

const $1 = window.$

const liveFrame = () => $1("iframe")[1]

export const $$ = isTheme ? (s) => $1(liveFrame()).contents().find(s) : $1

export function toTimer(secs){
    let min = 0;
    let hr = 0;
    while(secs >= 60){
        secs -= 60
        min++
    }
    while (min >= 60){
        min -= 60
        hr++
    }
    const mu = min > 9 ? `${min}`: `0${min}`
    const ms = secs > 9 ? `${secs}` : `0${secs}`
    return `${hr}:${mu}:${ms}`
}

export const logSettings = {
    changed: false,
    hasLog: false,
    hasSCLog: false
}

const roomReg = /^\/(blanc\/)?(?<id>\d+)/g
export const roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)


export default getSettings
