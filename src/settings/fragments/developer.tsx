import { Typography, Input, Alert, Button } from "@material-tailwind/react";
import { Fragment, type ChangeEvent, type ChangeEventHandler } from "react";
import type { ExposeHandler, StateProxy } from "~hooks/binding";
import type { Leaves, PickLeaves } from "~types/common";

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


type ElementDefiner = {
    label: string
    key: Leaves<SettingSchema>
}


type ElementDefinerList = {
    [title: string]: ElementDefiner[]
}


const elementDefiners: ElementDefinerList = {
    "元素捕捉 (JQuery)": [
        {
            label: "上方按钮界面元素",
            key: "elements.upperButtonArea"
        },
        {
            label: "弹幕容器元素",
            key: "elements.danmakuArea"
        },
        {
            label: "用户 ID 元素  (.attr('href'))",
            key: "elements.userId"
        },
        {
            label: "字幕区块全屏插入元素  (.after(字幕区块))",
            key: "elements.jimakuArea"
        },
        {
            label: "字幕区块非全屏插入元素  (.after(字幕区块))",
            key: "elements.jimakuFullArea"
        },
        {
            label: "直播屏幕区块",
            key: "elements.videoArea"
        },
        {
            label: "直播标题  ([0].innerText)",
            key: "elements.liveTitle"
        },
        {
            label: "直播聊天栏列表",
            key: "elements.chatItems"
        },
        {
            label: "新消息按钮  (聊天栏置底按钮)",
            key: "elements.newMsgButton"
        },
    ],
    "字样捕捉": [
        {
            label: "直播网页全屏 class",
            key: "classes.screenWeb"
        },
        {
            label: "直播全屏 class",
            key: "classes.screenFull"
        },
        {
            label: "聊天条 用户id 属性",
            key: "attr.chatUserId"
        },
        {
            label: "聊天条 弹幕 属性",
            key: "attr.chatDanmaku"
        },
    ],
    "JavaScript 代码": [
        {
            label: "获取网页内目前的 SuperChat",
            key: "code.scList"
        },
    ],
}


function DeveloperSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>, string>((e) => e.target.value)

    const alertIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 stroke-white"
        >
            <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
            />
        </svg>
    )

    return (
        <div className="col-span-2 container grid grid-cols-1 gap-5 w-full">
            <Alert
                className="bg-[#f8d7da] text-[#721c24]"
                icon={alertIcon}
                action={
                    <Button
                        size="sm"
                        className="!absolute top-3 right-3 text-white bg-red-500"
                    >
                        获取最新版本
                    </Button>}
            >
                若你本身并不熟悉网页开发，请尽量别碰这里的设定
            </Alert>
            {Object.entries(elementDefiners).map(([title, definers], index) => (
                <Fragment key={index}>
                    <Typography variant="h3">
                        {title}
                    </Typography>
                    {definers.map(({ label, key }) => (
                        <Input
                            key={key}
                            crossOrigin="anonymous"
                            variant="static"
                            label={label}
                            value={(state as ExposeHandler<SettingSchema>).get(key)}
                            onChange={handler(key)} />
                    ))}
                </Fragment>
            ))}
        </div>
    )
}


export default DeveloperSettings