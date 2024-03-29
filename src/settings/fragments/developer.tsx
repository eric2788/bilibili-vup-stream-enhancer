import { Alert, Button, Input, Typography } from '@material-tailwind/react';
import { Fragment, type ChangeEvent } from 'react';
import { toast } from 'sonner/dist';
import type { ExposeHandler, StateProxy } from "~hooks/binding";
import type { Leaves } from "~types/common";
import { sendMessager } from '~utils/messaging';
import { setSettingStorage } from '~utils/storage';

export type SettingSchema = {
    elements: {
        upperHeaderArea: string;
        upperButtonArea: string;
        webPlayer: string;
        danmakuArea: string;
        userName: string;
        jimakuArea: string;
        jimakuFullArea: string;
        videoArea: string;
        liveTitle: string;
        chatItems: string;
        newMsgButton: string;
        upperInputArea: string;
        liveReplay: string;
        liveIdle: string;
    };
    classes: {
        screenWeb: string;
        screenFull: string;
    };
    attr: {
        chatUserId: string;
        chatDanmaku: string;
    };
};

export const defaultSettings: Readonly<SettingSchema> = {
    elements: {
        upperHeaderArea: 'div.upper-row > div.left-ctnr.left-header-area', // 上方标题界面元素
        upperButtonArea: '.lower-row .left-ctnr', // 上方按钮界面元素
        webPlayer: '.web-player-danmaku', // 播放器元素
        danmakuArea: '.danmaku-item-container', // 弹幕容器元素
        userName: '.room-owner-username', // 用户 ID 元素
        jimakuArea: 'div.player-section', // 字幕区块全屏插入元素
        jimakuFullArea: '.web-player-inject-wrap', // 字幕区块非全屏插入元素
        videoArea: 'div#aside-area-vm', // 直播屏幕区块
        liveTitle: '.live-skin-main-text.small-title', // 直播标题
        chatItems: '#chat-items', // 直播聊天栏列表
        newMsgButton: 'div#danmaku-buffer-prompt', // 新消息按钮
        upperInputArea: '.control-panel-icon-row .icon-left-part', // 输入框区域的上方
        liveReplay: '.web-player-round-title', // 直播回放时会出现的元素
        liveIdle: '.web-player-ending-panel', // 直播空闲时会出现的元素
    },
    classes: {
        screenWeb: 'player-full-win', // 直播网页全屏 class
        screenFull: 'fullscreen-fix' // 直播全屏 class
    },
    attr: {
        chatUserId: 'data-uid', // 聊天条 用户id 属性
        chatDanmaku: 'data-danmaku' // 聊天条 弹幕 属性
    }
}

export const title = '开发者相关'

export const description = [
    '此设定区块是控制抓取元素的设定，这里的默认数值都是针对当前版本的B站页面。',
    '若B站页面发生改版, 本扩展将无法抓取元素致无法运作。除了等待本扩展的修复版本更新外, 有JS开发经验的用户可以自行修改此区块的数值以适应新版面。',
    '至于没有JS开发经验的用户，则尽量不要碰这里的设定，否则有可能导致扩展无法正常运作。'
]

type ElementDefiner = {
    label: string
    key: Leaves<SettingSchema>
}


type ElementDefinerList = {
    [title: string]: ElementDefiner[]
}


const elementDefiners: ElementDefinerList = {
    "元素捕捉": [
        {
            label: "上方标题界面元素",
            key: "elements.upperHeaderArea"
        },
        {
            label: "上方按钮界面元素",
            key: "elements.upperButtonArea"
        },
        {
            label: "弹幕容器元素",
            key: "elements.danmakuArea"
        },
        {
            label: '播放器元素',
            key: 'elements.webPlayer'
        },
        {
            label: "用户名元素",
            key: "elements.userName"
        },
        {
            label: "字幕区块全屏插入元素",
            key: "elements.jimakuArea"
        },
        {
            label: "字幕区块非全屏插入元素",
            key: "elements.jimakuFullArea"
        },
        {
            label: "直播屏幕区块",
            key: "elements.videoArea"
        },
        {
            label: "直播标题",
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
        {
            label: "输入框区域的上方",
            key: "elements.upperInputArea"
        },
        {
            label: "直播回放时会出现的元素",
            key: "elements.liveReplay"
        },
        {
            label: "直播空闲时会出现的元素",
            key: "elements.liveIdle"
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
    ]
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

    const fetchDeveloper = async () => {
        if (!window.confirm('这将覆盖开发者相关所有目前设定。')) return
        const fetching = (async function(){
            const { data, error } = await sendMessager('fetch-developer')
            if (error) throw new Error(error)
            await setSettingStorage('settings.developer', data)
        })()
        toast.promise(fetching, {
            loading: '正在获取远端最新开发者设定...',
            success: '已成功获取最新版本，请重新加载网页。',
            error: (err) => '获取最新版本失败: '+err.message
        })
        await fetching
    }

    return (
        <div className="col-span-2 container grid grid-cols-1 gap-5 w-full">
            <Alert
                className="bg-[#f8d7da] text-[#721c24]"
                icon={alertIcon}
                action={
                    <Button
                        onClick={fetchDeveloper}
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
                            data-testid={key}
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