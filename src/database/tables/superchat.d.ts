import { type Table } from "dexie";
import { IndexedDatabase, type CommonSchema } from "~database";

declare module '~database' {
    interface IndexedDatabase {
        superchats: Table<Superchat, number>;
    }
}

interface Superchat extends CommonSchema {
    text: string
    color: string
    rmb: number
    sender: string
}

export default "text, color, rmb, sender"