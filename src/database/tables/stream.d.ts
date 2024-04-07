import { Table } from 'dexie'
import { CommonSchema } from '~database'

declare module '~database' {
    interface IndexedDatabase {
        streams: Table<Streams, number>
    }
}

interface Streams extends CommonSchema {
    content: Blob
    order: number
}