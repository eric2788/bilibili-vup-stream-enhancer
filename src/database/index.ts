import Dexie, { type Table } from "dexie";
import migrate from "./migrations";

export interface CommonSchema {
    id?: number
    date: string
    room: string
}

export const commonSchema = "++id, date, room, ";

export type TableType = { [K in keyof IndexedDatabase]: IndexedDatabase[K] extends Table ? K : never }[keyof IndexedDatabase]

export class IndexedDatabase extends Dexie {
    public constructor() {
        super("bjf_db")
        migrate(this)
    }
}

const db = new IndexedDatabase()

export default db