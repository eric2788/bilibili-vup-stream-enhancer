
import { Fragment } from "react"
import DataTable, { type TableHeader } from "~settings/components/DataTable"
import type { StateProxy } from "~hooks/binding"
import type { ArrElement } from "~types"
import { removeArr } from "~utils/misc"


export type UserRecord = {
    id: string,
    name: string,
    addedDate: string
}


export type SettingSchema = {
    tongchuanMans: UserRecord[],
    tongchuanBlackList: UserRecord[],
    blackListRooms: { room: string, addedDate: string }[]
}


export const defaultSettings: Readonly<SettingSchema> = {
    tongchuanMans: [],
    tongchuanBlackList: [],
    blackListRooms: [
        {
            room: '1',
            addedDate: '2021-01-01'
        }
    ]
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


    const deleteIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 dark:stroke-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    )

    return (
        <Fragment>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.tongchuanMans>>
                    title="同传名单"
                    headers={user_headers}
                    values={state.tongchuanMans}
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
                />
            </div>
        </Fragment>
    )
}

export default ListingSettings