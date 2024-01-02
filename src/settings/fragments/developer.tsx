import type { StateProxy } from "~hooks/binding";

export type SettingSchema = {
    elements: {
        upperButtonArea: string;
        danmakuArea: string;
        userId: string;
        jimakuArea: string;
        jimakuFullArea: string;
        videoArea: string;
        liveTitle: string;
        chatItems: string;
        newMsgButton: string;
    };
    classes: {
        screenWeb: string;
        screenFull: string;
    };
    attr: {
        chatUserId: string;
        chatDanmaku: string;
    };
    code: {
        scList: string;
    };
};

export const defaultSettings: Readonly<SettingSchema> = {
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

export const title = '开发者相关'

function DeveloperSettings({state, useHandler}: StateProxy<SettingSchema>): JSX.Element {
    return <></>
}


export default DeveloperSettings