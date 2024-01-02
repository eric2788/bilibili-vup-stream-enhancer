import { Table } from 'dexie';
import { CommonSchema } from '~database';

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
