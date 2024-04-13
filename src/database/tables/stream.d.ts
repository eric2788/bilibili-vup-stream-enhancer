import { Table } from 'dexie'
import { CommonSchema } from '~database'

declare module '~database' {
    interface IndexedDatabase {
        streams: Table<Stream, number>
    }
}

interface Stream extends CommonSchema {
    content: Blob
    order: number
}