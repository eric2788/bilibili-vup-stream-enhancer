import type { FeatureType } from "~features";
import type { Optional } from "~types/common";
import type { TableType } from "~database";
import db from "~database";
import { download } from "~utils/file";
import { toast } from "sonner/dist";
import { useCallback } from "react";

export type RecordInfo<T> = {
    feature: FeatureType
    table: Optional<TableType>
    description: string
    format: (record: T) => string 
    clearRecords: VoidFunction
    reverse?: boolean
}

export function useRecords<T>(room: string, records: T[], info: RecordInfo<T>) {
    
    const downloadRecords = useCallback(() => {
        if (records.length === 0) {
            toast.warning(`下载失败`, {
                description: `${info.description}记录为空。`,
                position: 'bottom-center'
            })
            return
        }
        if (info.reverse) {
            records = records.toReversed()
        }
        const content = records.map(info.format).join('\n')
        download(`${info.description}-${room}-${new Date().toISOString().substring(0, 10)}.log`, content)
        toast.success(`下载成功`, {
            description: `你的${info.description}记录已保存。`,
            position: 'bottom-center'
        })
    }, [records]) // only records will change
    
    const deleteRecords = useCallback(() => {
        const deleting = async () => {
            let count = records.length
            if (info.table) {
                count = await db[info.table]
                    .where({ room })
                    .delete()
            }
            info.clearRecords()
            return count
        }
        toast.promise(deleting, {
            loading: `正在删除房间 ${room} 的所有${info.description}记录...`,
            error: (err) => `删除醒目留言记录失败: ${err}`,
            success: (count) => count ? `已删除房间 ${room} 共${count}条${info.description}记录` : `沒有${info.description}记录需要被删除`,
            position: 'bottom-center'
        })
    }, [ records, info.clearRecords ])
 
    return {
        downloadRecords,
        deleteRecords
    }
}