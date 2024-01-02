import type { Table } from "dexie"
import db, { type CommonSchema, type TableType } from "~database"
import { getAllTables } from "~utils/database"


async function clearIndexedDbTable(table: TableType | 'all', room?: string) {
    const tables: Table<CommonSchema, number>[] = []
    if (table === 'all') {
        tables.push(...getAllTables())
    } else {
        tables.push(db[table])
    }
    if (room) {
        await Promise.all(tables.map(table => table.where({ room }).delete()))
    } else {
        await Promise.all(tables.map(table => table.clear()))
    }
}

export default clearIndexedDbTable