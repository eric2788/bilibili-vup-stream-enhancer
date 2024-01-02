import type { Table } from "dexie"
import db, { type CommonSchema, type TableType } from "~database"
import { getAllTables } from "~utils/database"
import { injectFuncAsListener } from "~utils/event"

// yup chrome scripting v3 supports async functions
async function clearIndexedDbTable(table: TableType | 'all', room?: string) {
    try {
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
    } catch (err) {
        console.error(err)
    }
}

injectFuncAsListener(clearIndexedDbTable)