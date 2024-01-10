import { useCallback, type ChangeEvent, type SyntheticEvent } from 'react';
import { ensureIsVtuber, type StreamInfo } from '~api/bilibili';
import SwitchListItem from '~settings/components/SwitchListItem';
import { sendMessager } from '~utils/messaging';

import { Collapse, IconButton, List, ListItem, Switch, Typography } from '@material-tailwind/react';

import { toast } from 'sonner/dist';
import type { TableType } from "~database";
import type { FeatureType } from "~features";
import { asStateProxy, useBinding, type StateProxy, type StateHandler, type ExposeHandler } from "~hooks/binding";
import ExperienmentFeatureIcon from '~settings/components/ExperientmentFeatureIcon';
import FeatureRoomTable from '~settings/components/FeatureRoomTable';
import settings, { featureTypes, type FeatureFragment, type FeatureSettings, type FeatureSettingSchema } from '~settings/features';
import type { Leaves, PickLeaves, RoomList } from '~types/common';


export type SettingSchema = {
    enabledFeatures: FeatureType[],
    enabledRecording: FeatureType[],
    roomList: Record<FeatureType, RoomList>,
    common: {
        enabledPip: boolean,
        onlyVtuber: boolean,
        monitorWindow: boolean,
        useStreamingTime: boolean
    }
} & { [K in FeatureType]: FeatureSettingSchema<FeatureSettings[K]> }


export const defaultSettings: Readonly<SettingSchema> = {
    enabledFeatures: featureTypes,
    enabledRecording: [],
    common: {
        enabledPip: false,
        onlyVtuber: false,
        monitorWindow: false,
        useStreamingTime: true
    },
    roomList: featureTypes.reduce((acc: Record<FeatureType, RoomList>, cur: FeatureType) => {
        acc[cur] = {
            list: [],
            asBlackList: false
        };
        return acc;
    }, {} as Record<FeatureType, RoomList>),

    ...featureTypes.reduce((acc, f: FeatureType) => {
        return {
            ...acc,
            [f as FeatureType]: settings[f].defaultSettings as FeatureSettingSchema<FeatureSettings[typeof f]>
        }
    }, {} as { [K in FeatureType]: FeatureSettingSchema<FeatureSettings[K]> }),
}

export const title = '功能设定'

function FeatureSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const toggle = (feature: FeatureType) => {
        if (state.enabledFeatures.includes(feature)) {
            state.enabledFeatures = state.enabledFeatures.filter(f => f !== feature)
        } else {
            state.enabledFeatures.push(feature)
        }
    }

    const toggleRecord = (feature: FeatureType) => {
        if (state.enabledRecording.includes(feature)) {
            state.enabledRecording = state.enabledRecording.filter(f => f !== feature)
        } else {
            state.enabledRecording.push(feature)
        }
    }


    const onChangePip = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        if (checked && !window.PictureInPictureWindow) {
            toast.error('当前浏览器不支持自定义元素的画中画视窗。', {
                action: {
                    label: '查看支援的浏览器',
                    onClick: () => {
                        window.open('https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API#browser_compatibility', '_blank')
                    }
                },
                position: 'top-center'
            })
            return
        } else if (checked) {
            toast.success('启用后，你可以透过按住 Ctrl 点击按钮来弹出画中画视窗。', {
                position: 'top-center'
            })
        }
        console.info(state.common)
        state.common.enabledPip = checked
    }, [])

    return (
        <div className="col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <div>
                    <Typography className="font-semibold">
                        通用设定
                    </Typography>
                </div>
                <List className="pl-6">
                    <SwitchListItem label="仅限虚拟主播" value={state.common.onlyVtuber} onChange={checker('common.onlyVtuber')} />
                    <SwitchListItem
                        label="启用监控视窗"
                        hint="如要传入字幕或弹幕，必须开着直播间"
                        value={state.common.monitorWindow}
                        onChange={checker('common.monitorWindow')}
                        marker={<ExperienmentFeatureIcon />}
                    />
                    <SwitchListItem label={(v) => `使用${v ? '直播' : '真实'}时间戳记`} value={state.common.useStreamingTime} onChange={checker('common.useStreamingTime')} />
                    <SwitchListItem
                        label="启用画中画弹出视窗"
                        hint='目前只支援 chromium 浏览器, 且视窗数量上限为一个。开启第二个画中画视窗将会导致前一个画中画视窗关闭。'
                        value={state.common.enabledPip}
                        onChange={onChangePip}
                        marker={<ExperienmentFeatureIcon />}
                    />
                </List>
            </div>
            {...featureTypes.map((f: FeatureType) => {

                // mechanism same as src/settings/components/SettingFragment.tsx
                type F = typeof f
                const setting = settings[f] as FeatureSettings[F]
                const Component = setting.default as React.FC<StateProxy<FeatureSettingSchema<FeatureSettings[F]>>>
                const props = asStateProxy(useBinding(state[f], true))

                return (
                    <div key={f} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                        <Switch label={
                            <div>
                                <Typography className="font-semibold">
                                    启用{setting.title}
                                </Typography>
                            </div>
                        } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes(f)} onChange={e => toggle(f)} />
                        <Collapse open={state.enabledFeatures.includes(f)}>
                            <List className="pl-6">
                                {setting.define.offlineTable !== false && (
                                    <SwitchListItem
                                        label="启用离线记录"
                                        value={state.enabledRecording.includes(f)}
                                        onChange={e => toggleRecord(f)}
                                        suffix={
                                            <TrashIconButton table={setting.define.offlineTable} title={setting.title} />
                                        }
                                    />
                                )}
                                {Component && <Component {...props} />}
                                {setting.define.enabledRoomList && (
                                    <ListItem ripple={false} className='w-full bg-transparent hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent dark:focus:bg-transparent cursor-default'>
                                        <FeatureRoomTable
                                            feature={f}
                                            roomList={state.roomList}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>
                    </div>
                )
            })}
        </div>
    )
}


function TrashIconButton({ table, title }: { table: TableType, title: string }): JSX.Element {
    const deleteRecords = async () => {
        if (!confirm(`确定要清空所有${title}吗？`)) return
        const deleting = (async () => {
            const re = await sendMessager('clear-table', { table })
            if (re instanceof Object && re.result !== 'success') {
                throw new Error(re.error)
            }
        })();
        toast.promise(deleting, {
            loading: '正在清空...',
            success: `所有${title}记录已经清空。`,
            error: err => `清空${title}记录失败: ` + err.message
        })
    }

    return (
        <IconButton variant="text" onClick={deleteRecords}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 dark:stroke-white"
            >
                <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                    clipRule="evenodd"
                />
            </svg>
        </IconButton>
    );
}

export async function shouldInit(settings: SettingSchema, info: StreamInfo): Promise<boolean> {

    if (!info) {
        // do log
        console.info('無法取得直播資訊，已略過')
        return false
    }

    if (info.status === 'offline' && settings.enabledRecording.length === 0) {
        console.info('直播為下綫狀態，且沒有啓用離綫儲存，已略過。')
        return false
    }

    if (settings.common.onlyVtuber) {

        if (info.uid !== '0') {
            await ensureIsVtuber(info)
        }

        if (!info.isVtuber) {
            // do log
            console.info('不是 VTuber, 已略過')
            return false
        }

    }

    return true
}

export default FeatureSettings