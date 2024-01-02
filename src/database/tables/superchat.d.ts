import { Table } from 'dexie'
import { CommonSchema } from '~database'

declare module '~database' {
    interface IndexedDatabase {
        superchats: Table<Superchat, number>
    }
}

interface Superchat extends CommonSchema {
    backgroundColor: string
    backgroundImage: string,
    backgroundHeaderColor: string,
    userIcon: string,
    nameColor: string,
    uid: number
    uname: string
    price: number
    message: string
    hash: string
    timestamp: number
    date: string
}
