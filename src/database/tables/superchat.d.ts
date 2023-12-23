import { type Table } from "dexie";
import { type CommonSchema } from "~database";

declare module '~database' {
    interface IndexedDatabase {
        superchats: Table<Superchat, number>;
    }
}

interface Superchat extends CommonSchema {
    text: string
    color: string
    price: number
    sender: string
}
