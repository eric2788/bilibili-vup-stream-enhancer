
import { Fragment, type ChangeEvent } from 'react';
import { requestUserInfo, type StreamInfo } from '~api/bilibili';
import DataTable, { type TableHeader } from '~settings/components/DataTable';
import { catcher } from '~utils/fetch';
import { removeArr } from '~utils/misc';

import { Switch, Typography } from '@material-tailwind/react';

import { toast } from 'sonner/dist';
import type { ExposeHandler, StateProxy } from "~hooks/binding";
import DeleteIcon from '~settings/components/DeleteIcon';
import type { ArrElement, PickKeys } from "~types/common";

export type UserRecord = {
    id: string,
    name: string,
    addedDate: string
}


export type SettingSchema = {
    tongchuanMans: UserRecord[],
    tongchuanBlackList: UserRecord[],
    blackListRooms: { room: string, addedDate: string }[],
    useAsWhiteListRooms: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    tongchuanMans: [],
    tongchuanBlackList: [],
    blackListRooms: [
        {
            room: '1',
            addedDate: '2021/1/1'
        }
    ],
    useAsWhiteListRooms: false
}


const user_headers: TableHeader<UserRecord>[] = [
    {
        name: '用户ID',
        value: 'id'
    },
    {
        name: '用户名',
        value: 'name'
    },
    {
        name: '添加时间',
        value: 'addedDate',
        align: 'center'
    }
]

const room_headers: TableHeader<{ room: string, addedDate: string }>[] = [
    {
        name: '房间号',
        value: 'room'
    },
    {
        name: '添加时间',
        value: 'addedDate',
        align: 'center'
    }
]


export const title = '名单列表'

function ListingSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    const addUserRecord = <K extends PickKeys<SettingSchema, UserRecord[]>>(key: K) => async (value: string) => {

        const handler = (state as ExposeHandler<SettingSchema>)

        if (state[key].some(e => e.id === value)) {
            toast.error(`用户 ${value} 已经在列表中`)
            return
        }
        const user = await catcher(requestUserInfo(value))
        if (!user) {
            toast.error(`用户 ${value} 不存在`)
            return
        }
        state[key].push({ id: user.mid.toString(), name: user.name, addedDate: new Date().toLocaleDateString() })
        handler.set(key, state[key] as any)
    }

    return (
        <Fragment>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.tongchuanMans>>
                    title="同传名单"
                    headers={user_headers}
                    values={state.tongchuanMans}
                    onAdd={addUserRecord('tongchuanMans')}
                    actions={[
                        {
                            label: '删除',
                            icon: <DeleteIcon />,
                            onClick: (e) => {
                                const result = removeArr(state.tongchuanMans, e)
                                if (!result) {
                                    toast.error('删除失败')
                                }
                            }
                        }
                    ]}
                />
            </div>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.tongchuanBlackList>>
                    title="同传黑名单"
                    headers={user_headers}
                    values={state.tongchuanBlackList}
                    onAdd={addUserRecord('tongchuanBlackList')}
                    actions={[
                        {
                            label: '删除',
                            icon: <DeleteIcon />,
                            onClick: (e) => {
                                const result = removeArr(state.tongchuanBlackList, e)
                                if (!result) {
                                    toast.error('删除失败')
                                }
                            }
                        }
                    ]}
                />
            </div>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.blackListRooms>>
                    title="房间黑名单(所有功能将不生效)"
                    headers={room_headers}
                    values={state.blackListRooms}
                    onAdd={(value) => {
                        if (state.blackListRooms.some(e => e.room === value)) {
                            toast.error(`房间 ${value} 已经在列表中`)
                            return
                        }
                        state.blackListRooms.push({ room: value, addedDate: new Date().toLocaleDateString() })
                    }}
                    actions={[
                        {
                            label: '删除',
                            icon: <DeleteIcon />,
                            onClick: (e) => {
                                const result = removeArr(state.blackListRooms, e)
                                if (!result) {
                                    toast.error('删除失败')
                                }
                            }
                        }
                    ]}
                    headerSlot={
                        <Switch
                            checked={state.useAsWhiteListRooms}
                            onChange={checker('useAsWhiteListRooms')}
                            crossOrigin={'annoymous'}
                            label={
                                <Typography className="font-semibold">
                                    使用为白名单
                                </Typography>
                            }
                        />
                    }
                />
            </div>
        </Fragment>
    )
}

export async function shouldInit(roomId: number, settings: Readonly<SettingSchema>, info: StreamInfo): Promise<boolean> {
    if (settings.blackListRooms.some((r) => r.room === roomId.toString()) === !settings.useAsWhiteListRooms) {
        console.info('房間已被列入黑名單，已略過')
        return false
    }
    return true
}

export default ListingSettings