import { Collapse, IconButton, List, Switch, Typography } from "@material-tailwind/react"
import { type ChangeEvent } from "react"
import { ensureIsVtuber, isNativeVtuber, type StreamInfo } from "~api/bilibili"
import { sendInternal } from "~background/messages"
import type { TableType } from "~database"
import type { FeatureType } from "~features"
import type { StateProxy } from "~hooks/binding"
import SwitchListItem from "~settings/components/SwitchListItem"
import { retryCatcher } from "~utils/fetch"
import func from "~utils/func"



export type SettingSchema = {
    enabledFeatures: FeatureType[],
    enabledRecording: FeatureType[],
    onlyVtuber: boolean,
    noNativeVtuber: boolean,
    jimakuPopupWindow: boolean, // only when enabledFeatures.includes('jimaku')
    monitorWindow: boolean,
    useStreamingTime: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    enabledFeatures: ['jimaku', 'superchat'],
    enabledRecording: [],
    onlyVtuber: false,
    noNativeVtuber: false,
    jimakuPopupWindow: false,
    monitorWindow: false,
    useStreamingTime: true
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
                    <SwitchListItem label="过滤国内虚拟主播" hint="需要先开启仅限虚拟主播才能生效" value={state.noNativeVtuber} onChange={checker('noNativeVtuber')} />
                    <SwitchListItem label="启用监控视窗" hint="如要传入字幕，必须开着直播间" value={state.monitorWindow} onChange={checker('monitorWindow')} />
                    <SwitchListItem label={(v) => `使用${v ? '直播' : '真实'}时间戳记`} value={state.useStreamingTime} onChange={checker('useStreamingTime')} />
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
                        <SwitchListItem label="启用同传弹幕彈出式视窗" hint="使用弹出式视窗时必须开着直播间才能运行" value={state.jimakuPopupWindow} onChange={checker('jimakuPopupWindow')} />
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
                    </List>
                </Collapse>
            </div>
        </div>
    )
}


function TrashIconButton({ table, title }: { table: TableType, title: string }): JSX.Element {
    const deleteRecords = async () => {
        if (!confirm(`确定要清空所有${title}吗？`)) return
        try {
            //TODO: clear records
            await sendInternal('notify', {
                title: '清空成功',
                message: `所有${title}记录已经清空。`
            })
        } catch (err: Error | any) {
            await sendInternal('notify', {
                title: '清空失败',
                message: `清空${title}记录失败: ${err.message}`
            })
        }
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

    const isNativeVtuberFunc = func.wrap(isNativeVtuber)

    if (settings.onlyVtuber) {

        if (info.uid !== '0') {
            await ensureIsVtuber(info)
        }

        if (!info.isVtuber) {
            // do log
            console.info('不是 VTuber, 已略過')
            return false
        }

        if (settings.noNativeVtuber && (await retryCatcher(isNativeVtuberFunc(info.uid), 5))) {
            // do log
            console.info('檢測到為國V, 已略過')
            return false
        }
    }

    return true
}

export default FeatureSettings