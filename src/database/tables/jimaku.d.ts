import { type Table } from "dexie";
import { IndexedDatabase, type CommonSchema } from "~database";

declare module '~database' {
    interface IndexedDatabase {
        jimakus: Table<Jimaku, number>;
    }
}

interface Jimaku extends CommonSchema {
    text: string
    sender: string
}

export default "text, sender"