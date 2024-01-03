import type { ChangeEvent, ChangeEventHandler } from "react";
import { Switch, Typography } from "@material-tailwind/react";
import type { TableAction, TableHeader } from "./DataTable";

import DataTable from "./DataTable";
import DeleteIcon from "./DeleteIcon";
import type { FeatureType } from "~features";
import type { RoomList } from "~types/common";
import type { StateHandler } from "~hooks/binding";
import { removeArr } from "~utils/misc";
import { toast } from "sonner/dist";

const roomListHeaders: TableHeader<{ room: string, date: string }>[] = [
    {
        name: '房间号',
        value: 'room'
    },
    {
        name: '添加时间',
        value: 'date',
        align: 'center'
    }
]



export type FeatureRoomTableProps = {
    title?: string
    feature: FeatureType,
    roomList: Record<FeatureType, RoomList>,
    actions?: TableAction<{room: string, date: string}>[]
}

function FeatureRoomTable(props: FeatureRoomTableProps): JSX.Element {

    const { roomList, feature, title, actions } = props

    return (
        <DataTable
            title={title ?? '房间白名单(无数据时不生效)'}
            headers={roomListHeaders}
            values={roomList[feature].list}
            onAdd={room => {
                if (roomList[feature].list.some(e => e.room === room)) {
                    toast.error(`房间 ${room} 已经在列表中`)
                    return
                }
                roomList[feature].list.push({ room, date: new Date().toLocaleDateString() })
            }}
            headerSlot={
                <Switch
                    checked={roomList[feature].asBlackList}
                    onChange={e => roomList[feature].asBlackList = e.target.checked}
                    crossOrigin={'annoymous'}
                    label={
                        <Typography className="font-semibold">
                            使用为黑名单
                        </Typography>
                    }
                />
            }
            actions={[
                {
                    label: '删除',
                    icon: <DeleteIcon />,
                    onClick: (e) => {
                        const result = removeArr(roomList[feature].list, e)
                        if (!result) {
                            toast.error('删除失败')
                        }
                    }
                },
                ...(actions ?? [])
            ]}
        />
    )
}




export default FeatureRoomTable