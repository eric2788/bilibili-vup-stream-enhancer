
import { Fragment, type ChangeEvent } from "react"
import DataTable, { type TableHeader } from "~settings/components/DataTable"
import type { ExposeHandler, StateProxy } from "~hooks/binding"
import type { ArrElement, PickKeys, PickLeaves } from "~types/common"
import { removeArr } from "~utils/misc"
import { identifyVup } from "~api/vtb-moe"
import { catcher } from "~utils/fetch"
import { sendInternal } from "~background/messages"
import { requestUserInfo } from "~api/bilibili"
import { Switch, Typography } from "@material-tailwind/react"


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

    const deleteIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    )

    const addUserRecord = <K extends PickKeys<SettingSchema, UserRecord[]>>(key: K) => async (value: string) => {

        const handler = (state as ExposeHandler<SettingSchema>)

        if (state[key].some(e => e.id === value)) {
            alert(`用户 ${value} 已经在列表中`)
            return
        }
        const user = await catcher(requestUserInfo(value))
        if (!user) {
            alert(`用户 ${value} 不存在`)
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
                            icon: deleteIcon,
                            onClick: (e) => {
                                const result = removeArr(state.tongchuanMans, e)
                                if (!result) {
                                    alert('删除失败')
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
                            icon: deleteIcon,
                            onClick: (e) => {
                                const result = removeArr(state.tongchuanBlackList, e)
                                if (!result) {
                                    alert('删除失败')
                                }
                            }
                        }
                    ]}
                />
            </div>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.blackListRooms>>
                    title="黑名单房间"
                    headers={room_headers}
                    values={state.blackListRooms}
                    onAdd={(value) => {
                        if (state.blackListRooms.some(e => e.room === value)) {
                            alert(`房间 ${value} 已经在列表中`)
                            return
                        }
                        state.blackListRooms.push({ room: value, addedDate: new Date().toLocaleDateString() })
                    }}
                    actions={[
                        {
                            label: '删除',
                            icon: deleteIcon,
                            onClick: (e) => {
                                const result = removeArr(state.blackListRooms, e)
                                if (!result) {
                                    alert('删除失败')
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

export default ListingSettings