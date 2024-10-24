import { Alert, Button, Input, Switch, Typography } from '@material-tailwind/react';
import { Fragment, type ChangeEvent, type ExoticComponent } from 'react';
import { toast } from 'sonner/dist';
import type { ExposeHandler, StateProxy } from "~hooks/binding";
import type { Leaves } from "~types/common";
import { sendMessager } from '~utils/messaging';
import { removeSettingStorage, setSettingStorage } from '~utils/storage';

export type SettingSchema = {
    elements: {
        headInfoArea: string;
        upperHeaderArea: string;
        upperButtonArea: string;
        webPlayer: string;
        danmakuArea: string;
        userName: string;
        jimakuArea: string;
        jimakuFullArea: string;
        videoArea: string;
        livePlayerVideo: string;
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
    extra: {
        forceBoot: boolean;
    };
};

export const defaultSettings: Readonly<SettingSchema> = {
    elements: {
        headInfoArea: '#head-info-vm', // 直播头部元素
        upperHeaderArea: 'div.upper-row > div.left-ctnr.left-header-area', // 上方标题界面元素
        upperButtonArea: '.lower-row .left-ctnr', // 上方按钮界面元素
        webPlayer: '.web-player-danmaku', // 播放器元素
        danmakuArea: '.danmaku-item-container', // 弹幕容器元素
        userName: '.room-owner-username', // 用户 ID 元素
        jimakuArea: 'div.player-section', // 字幕区块全屏插入元素
        jimakuFullArea: '.web-player-inject-wrap', // 字幕区块非全屏插入元素
        videoArea: 'div#aside-area-vm', // 直播屏幕区块
        livePlayerVideo: '#live-player video', // 直播视频元素
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
    },
    extra: {
        forceBoot: false // 在直播间下线时依然强制启动
    }
}

export const title = '开发者相关'

export const description = [
    '此设定区块是控制抓取元素或其他实验性功能的设定，这里的默认数值都是针对当前版本的B站页面。',
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

type ComponentDefiner<T> = {
    Component: ExoticComponent<any>,
    handler: (e: ChangeEvent<HTMLInputElement>) => T,
    props?: (prop: { key: string, label: string, value: T, handler: (e: ChangeEvent<HTMLInputElement>) => T }) => object
}

const elementDefiners: ElementDefinerList = {
    "元素捕捉": [
        {
            label: "直播头部元素",
            key: "elements.headInfoArea"
        },
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
            label: "直播视频元素",
            key: "elements.livePlayerVideo"
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
    ],
    "其他设定": [
        {
            label: "在直播间下线时依然强制启动",
            key: "extra.forceBoot"
        }
    ]
}

const componentDefiners: Record<string, ComponentDefiner<any>> = {
    'string': {
        Component: Input,
        handler: (e: ChangeEvent<HTMLInputElement>) => e.target.value
    },
    'boolean': {
        Component: Switch,
        handler: (e: ChangeEvent<HTMLInputElement>) => e.target.checked,
        props: ({ key, label, value, handler }) => ({
            checked: value,
            onChange: handler,
            label: <Typography className="font-medium">{label}</Typography>
        })
    }
}


function DeveloperSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

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
        const fetching = (async function () {
            const { data, error } = await sendMessager('fetch-developer')
            if (error) throw new Error(error)
            await setSettingStorage('settings.developer', data)
        })()
        toast.promise(fetching, {
            loading: '正在获取远端最新开发者设定...',
            success: '已成功获取最新版本，请重新加载网页。',
            error: (err) => '获取最新版本失败: ' + err.message
        })
    }

    const resetDefault = async () => {
        if (!window.confirm('这将覆盖开发者相关至插件默认设定。')) return
        const removing = removeSettingStorage('settings.developer')
        toast.promise(removing, {
            loading: '正在重置开发者相关设定...',
            success: '已成功重置至默认设定，请重新加载网页。',
            error: (err) => '重置设定失败: ' + err.message
        })
    }

    return (
        <div className="col-span-2 container grid grid-cols-1 gap-5 w-full">
            <Alert
                className="bg-[#f8d7da] text-[#721c24] items-center"
                icon={alertIcon}
                action={
                    <div className="flex gap-1 flex-grow justify-end">
                        <Button
                            onClick={fetchDeveloper}
                            size="sm"
                            className=" text-white bg-red-500"
                        >
                            获取最新版本
                        </Button>
                        <Button
                            onClick={resetDefault}
                            size="sm"
                            className=" text-white bg-green-500"
                        >
                            重置设定
                        </Button>
                    </div>
                }
            >
                若你本身并不熟悉网页开发，请尽量别碰这里的设定
            </Alert>
            {Object.entries(elementDefiners).map(([title, definers], index) => (
                <Fragment key={index}>
                    <Typography variant="h3">
                        {title}
                    </Typography>
                    {definers.map(({ label, key }) => {
                        const value = (state as ExposeHandler<SettingSchema>).get(key)
                        const { Component, handler, props } = componentDefiners[typeof value]
                        const onChange = useHandler<ChangeEvent<HTMLInputElement>, typeof value>(handler)(key)
                        return (
                            <Component
                                data-testid={key}
                                key={key}
                                crossOrigin="anonymous"
                                {...(props ? props({ key, label, value, handler: onChange }) : {
                                    value,
                                    label,
                                    onChange,
                                })}
                            />
                        )
                    })}
                </Fragment>
            ))}
        </div>
    )
}


export default DeveloperSettings