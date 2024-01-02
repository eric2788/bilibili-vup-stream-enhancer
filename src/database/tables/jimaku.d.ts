import { Table } from 'dexie';
import { CommonSchema } from '~database';

declare module '~database' {
    interface IndexedDatabase {
        jimakus: Table<Jimaku, number>;
    }
}

interface Jimaku extends CommonSchema {
    text: string
    uid: number
    uname: string
    hash: string
}
