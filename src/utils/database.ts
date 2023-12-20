import type { Table } from "dexie"
import db, { type CommonSchema } from "~database"

export const getAllTables = () => Object.entries(db).filter(([, value]) => isTable(value)).map(([, v]) => v) as Table<CommonSchema, number>[]

//create a type guard for the tables
function isTable<T extends Table<CommonSchema, number>>(table: Table<CommonSchema, number>): table is T {
    return table.where !== undefined
}