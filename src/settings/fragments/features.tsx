import { type ChangeEvent } from 'react';
import { ensureIsVtuber, type StreamInfo } from '~api/bilibili';
import SwitchListItem from '~settings/components/SwitchListItem';
import { sendMessager } from '~utils/messaging';

import { Collapse, IconButton, List, ListItem, Switch, Tooltip, Typography } from '@material-tailwind/react';

import type { TableType } from "~database";
import type { FeatureType } from "~features";
import type { StateProxy } from "~hooks/binding";
import type { RoomList } from '~types/common';
import FeatureRoomTable from '~settings/components/FeatureRoomTable';
import { toast } from 'sonner/dist';




export type SettingSchema = {
    enabledFeatures: FeatureType[],
    enabledRecording: FeatureType[],
    enabledPip: boolean,
    onlyVtuber: boolean,
    noNativeVtuber: boolean,
    jimakuPopupWindow: boolean, // only when enabledFeatures.includes('jimaku')
    monitorWindow: boolean,
    useStreamingTime: boolean
    roomList: Record<FeatureType, RoomList>
}


export const defaultSettings: Readonly<SettingSchema> = {
    enabledFeatures: [
        'jimaku',
        'superchat'
    ],
    enabledRecording: [],
    enabledPip: false,
    onlyVtuber: false,
    noNativeVtuber: false,
    jimakuPopupWindow: false,
    monitorWindow: false,
    useStreamingTime: true,
    roomList: [
        'jimaku',
        'superchat'
    ].reduce((acc: Record<FeatureType, RoomList>, cur: FeatureType) => {
        acc[cur] = {
            list: [],
            asBlackList: false
        }
        return acc
    }, {} as Record<FeatureType, RoomList>)
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


    const onChangePip = (e: ChangeEvent<HTMLInputElement>) => {
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
        state.enabledPip = checked
    }

    const experienmentFeature = (
        <Tooltip content="测试阶段">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
        </Tooltip>
    )

    return (
        <div className="col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <div>
                    <Typography className="font-semibold">
                        通用设定
                    </Typography>
                </div>
                <List className="pl-6">
                    <SwitchListItem label="仅限虚拟主播" value={state.onlyVtuber} onChange={checker('onlyVtuber')} />
                    <SwitchListItem label="启用监控视窗" hint="如要传入弹幕，必须开着直播间" value={state.monitorWindow} onChange={checker('monitorWindow')} />
                    <SwitchListItem label={(v) => `使用${v ? '直播' : '真实'}时间戳记`} value={state.useStreamingTime} onChange={checker('useStreamingTime')} />
                    <SwitchListItem
                        label="启用画中画弹出视窗"
                        hint='目前只支援 chromium 浏览器, 且视窗数量上限为一个。开启第二个画中画视窗将会导致前一个画中画视窗关闭。'
                        value={state.enabledPip}
                        onChange={onChangePip}
                        marker={experienmentFeature}
                    />
                </List>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <Switch label={
                    <div>
                        <Typography className="font-semibold">
                            启用同传弹幕过滤
                        </Typography>
                    </div>
                } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes('jimaku')} onChange={e => toggle('jimaku')} />
                <Collapse open={state.enabledFeatures.includes('jimaku')}>
                    <List className="pl-6">
                        <SwitchListItem
                            label="启用离线记录"
                            value={state.enabledRecording.includes('jimaku')}
                            onChange={e => toggleRecord('jimaku')}
                            suffix={
                                <TrashIconButton table={'jimakus'} title="同传弹幕" />
                            }
                        />
                        <SwitchListItem
                            label="过滤国内虚拟主播"
                            hint="此功能目前处于测试阶段, 因此无法过滤所有的国V"
                            value={state.noNativeVtuber}
                            onChange={checker('noNativeVtuber')}
                            marker={experienmentFeature}
                        />
                        <SwitchListItem label="启用同传弹幕彈出式视窗" hint="使用弹出式视窗时必须开着直播间才能运行" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
                        <ListItem ripple={false} className='w-full bg-transparent hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent dark:focus:bg-transparent cursor-default'>
                            <FeatureRoomTable
                                feature='jimaku'
                                roomList={state.roomList}
                            />
                        </ListItem>
                    </List>
                </Collapse>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
                <Switch label={
                    <div>
                        <Typography className="font-semibold">
                            启用醒目留言记录
                        </Typography>
                    </div>
                } crossOrigin={'annoymous'} checked={state.enabledFeatures.includes('superchat')} onChange={e => toggle('superchat')} />
                <Collapse open={state.enabledFeatures.includes('superchat')}>
                    <List className="pl-6">
                        <SwitchListItem
                            label="启用离线记录"
                            value={state.enabledRecording.includes('superchat')}
                            onChange={e => toggleRecord('superchat')}
                            suffix={
                                <TrashIconButton table={'superchats'} title="醒目留言" />
                            }
                        />
                        <ListItem ripple={false} className='w-full bg-transparent hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent dark:focus:bg-transparent cursor-default'>
                            <FeatureRoomTable
                                feature='superchat'
                                roomList={state.roomList}
                            />
                        </ListItem>
                    </List>
                </Collapse>
            </div>
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

export async function shouldInit(roomId: string, settings: SettingSchema, info: StreamInfo): Promise<boolean> {

    if (!info) {
        // do log
        console.info('無法取得直播資訊，已略過')
        return false
    }

    if (info.status === 'offline' && settings.enabledRecording.length === 0) {
        console.info('直播為下綫狀態，且沒有啓用離綫儲存，已略過。')
        return false
    }

    if (settings.onlyVtuber) {

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