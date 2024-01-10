import Dexie, { type Table } from 'dexie'

import migrate from './migrations'

export interface CommonSchema {
    id?: number
    date: string
    room: string
}

export const commonSchema = "++id, date, room, "

export type TableType = { [K in keyof IndexedDatabase]: IndexedDatabase[K] extends Table ? K : never }[keyof IndexedDatabase]

export type RecordType<T extends TableType> = IndexedDatabase[T] extends Table<infer R> ? R : never

export class IndexedDatabase extends Dexie {
    public constructor() {
        super("bilibili-vup-stream-enhancer")
        migrate(this)
    }
}

const db = new IndexedDatabase()

export default db