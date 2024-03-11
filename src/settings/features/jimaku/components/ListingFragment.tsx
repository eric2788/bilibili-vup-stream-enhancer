import { Fragment } from "react"
import { toast } from "sonner/dist"
import { requestUserInfo } from "~api/bilibili"
import type { ExposeHandler, StateProxy } from "~hooks/binding"
import type { TableHeader } from "~settings/components/DataTable"
import DataTable from "~settings/components/DataTable"
import DeleteIcon from "~settings/components/DeleteIcon"
import type { WbiAccInfoResponse } from "~types/bilibili"
import type { ArrElement, PickKeys } from "~types/common"
import { catcher } from "~utils/fetch"
import { removeArr } from "~utils/misc"


export type UserRecord = {
    id: string,
    name: string,
    addedDate: string
}


export type ListingSchema = {
    tongchuanMans: UserRecord[],
    tongchuanBlackList: UserRecord[],
}

export const listingDefaultSettings: Readonly<ListingSchema> = {
    tongchuanMans: [],
    tongchuanBlackList: [],
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

function ListingFragment({ state, useHandler }: StateProxy<ListingSchema>): JSX.Element {

    const addUserRecord = <K extends PickKeys<ListingSchema, UserRecord[]>>(key: K) => async (value: string, e: KeyboardEvent) => {

        const handler = (state as ExposeHandler<ListingSchema>)

        if (state[key].some(e => e.id === value)) {
            toast.error(`用户 ${value} 已经在列表中`)
            return
        }

        let user: Partial<WbiAccInfoResponse> = undefined

        if (!e.shiftKey) {
            try {
                user = await requestUserInfo(value)
                if (!user) {
                    toast.error(`用户 ${value} 不存在`)
                    return
                }
            } catch (err) {
                console.error(err)
                toast.error(
                    <div className="flex flex-col space-y-0 m-0 p-0">
                        <div className="text-[15px]">
                            添加用户 {value} 失败: {err?.message ?? String(err)}
                        </div>
                        <small>(使用 Shift Enter 可略过用户验证)</small>
                    </div>
                )
            }
        } else {
            const mid = parseInt(value)
            if (isNaN(mid)) {
                toast.error(`添加用户 ${value} 失败: 不是有效的数字`)
                return
            }
            user = { mid, name: '用戶' + value }
        }


        state[key].push({ id: user.mid.toString(), name: user.name, addedDate: new Date().toLocaleDateString() })
        handler.set(key, state[key] as any)
        toast.success(`添加用户 ${value} 成功`)
    }


    return (
        <Fragment>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.tongchuanMans>>
                    title="同传名单"
                    data-testid="tongchuan-mans"
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
                    data-testid="tongchuan-blacklist"
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
        </Fragment>
    )
}

export default ListingFragment

