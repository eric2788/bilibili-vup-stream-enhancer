
import { Fragment, type ChangeEvent } from 'react';
import DataTable, { type TableHeader } from '~options/components/DataTable';
import { removeArr } from '~utils/misc';

import { Switch, Typography } from '@material-tailwind/react';

import { toast } from 'sonner/dist';
import type { StateProxy } from "~hooks/binding";
import DeleteIcon from '~options/components/DeleteIcon';
import type { ArrElement } from "~types/common";

export type SettingSchema = {
    blackListRooms: { room: string, addedDate: string }[],
    useAsWhiteListRooms: boolean
}

export const defaultSettings: Readonly<SettingSchema> = {
    blackListRooms: [],
    useAsWhiteListRooms: false
}

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

export const description = `此设定区块包含了一些名单列表相关的设定, 你可以在这里调整各个名单列表。`

function ListingSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    return (
        <Fragment>
            <div className="col-span-2">
                <DataTable<ArrElement<typeof state.blackListRooms>>
                    data-testid="black-list-rooms"
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


export default ListingSettings