export const isFirefox = navigator.userAgent.indexOf('Firefox') > -1

export const isChrome = navigator.userAgent.indexOf('Chrome') > -1

export const isOpera = navigator.userAgent.indexOf("OP") > -1

export const isEdge = navigator.userAgent.indexOf("Edg") > -1

export const canUseButton = isChrome

const defaultSettings = {
    regex: '^(?<n>[^【】]+?)?\\:?\\s*【(?<cc>[^【】]+?)(】.?)?$',
    opacity: -1,
    color: '',
    hideJimakuDanmaku: false,
    vtbOnly: true,
    record: false,
    backgroundSubtitleOpacity: 40,
    backgroundColor: '#808080',
    backgroundHeight: 100,
    tongchuanMans: [],
    tongchuanBlackList: [],
    subtitleColor: '#FFFFFF',
    blacklistRooms: [],
    useAsWhitelist: false,
    subtitleSize: 16,
    firstSubtitleSize: 18,
    lineGap: 7,
    jimakuAnimation: 'top',
    jimakuPosition: 'center',
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
    enableRestart: false,
    enableJimakuPopup: false,
    enableStreamPopup: false,
    filterLevel: 0,
    useLegacy: false,
    hideBlackList: false,
    hideSettingBtn: false,
    themeToNormal: false,
    useRemoteCDN: false,
    developer: {
        elements: {
            upperButtonArea: '.rows-ctnr', // 上方按钮界面元素
            danmakuArea: '.web-player-danmaku', // 弹幕容器元素
            userId: 'a.room-owner-username', // 用户 ID 元素
            jimakuArea: 'div.player-section', // 字幕区块全屏插入元素
            jimakuFullArea: '.web-player-inject-wrap', // 字幕区块非全屏插入元素
            videoArea: 'div#aside-area-vm', // 直播屏幕区块
            liveTitle: '.live-skin-main-text.small-title', // 直播标题
            chatItems: '#chat-items', // 直播聊天栏列表
            newMsgButton: 'div#danmaku-buffer-prompt', // 新消息按钮
        },
        classes: {
            screenWeb: 'player-full-win', // 直播网页全屏 class
            screenFull: 'fullscreen-fix' // 直播全屏 class
        },
        attr: {
            chatUserId: 'data-uid', // 聊天条 用户id 属性
            chatDanmaku: 'data-danmaku' // 聊天条 弹幕 属性
        },
        code: {
            scList: 'window.__NEPTUNE_IS_MY_WAIFU__ ? window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list : []'
        }
    }
}

async function getSettings(){
    const res = await browser.storage.sync.get()
    return {...defaultSettings, ...res}
}

export async function sleep(ms) {
    return new Promise((res,) => setTimeout(res, ms))
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

export const isTheme = location.pathname.indexOf('blanc') > -1 && location.search.indexOf('liteVersion') > -1

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

export const roomReg = /^\/(blanc\/)?(?<id>\d+)/g
roomReg.lastIndex = 0
export const roomId = parseInt(roomReg.exec(location.pathname)?.groups?.id)


export default getSettings
