import type { FeatureType } from "~features";
import type { Optional } from "~types/common";
import type { TableType } from "~database";
import db from "~database";
import { download } from "~utils/file";
import { toast } from "sonner/dist";
import { useCallback } from "react";

export type RecordInfo<T> = {
    feature: FeatureType
    table?: TableType
    description: string
    format: (record: T) => string
    clearRecords: VoidFunction
    reverse?: boolean
}

/**
 * Custom hook for managing records.
 * @template T - The type of records.
 * @param {string} room - The room identifier.
 * @param {T[]} records - The array of records.
 * @param {RecordInfo<T>} info - The information about the records.
 * @returns {Object} - An object containing the downloadRecords and deleteRecords functions.
 * @example
 * const records = [
 *   { id: 1, message: 'Hello' },
 *   { id: 2, message: 'World' }
 * ];
 * const info = {
 *   description: 'chat',
 *   reverse: false,
 *   format: (record) => `${record.id}: ${record.message}`,
 *   feature: 'chat-logs',
 *   clearRecords: () => { /* clear records logic *\/ }
 * };
 * const { downloadRecords, deleteRecords } = useRecords('room1', records, info);
 * downloadRecords(); // Downloads the chat records for room1
 * deleteRecords(); // Deletes all chat records for room1
 */
export function useRecords<T>(room: string, records: T[], info: RecordInfo<T>) {

    const downloadRecords = useCallback(() => {
        if (records.length === 0) {
            toast.warning(`下载失败`, {
                description: `${info.description}记录为空。`,
            })
            return
        }
        if (info.reverse) {
            records = records.toReversed()
        }
        const content = records.map(info.format).join('\n')
        download(`${info.feature}-${room}-${new Date().toISOString().substring(0, 10)}.log`, content)
        toast.success(`下载成功`, {
            description: `你的${info.description}记录已保存。`,
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

        })
    }, [records, info.clearRecords])

    return {
        downloadRecords,
        deleteRecords
    }
}