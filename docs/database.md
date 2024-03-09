# 数据库

本扩展的数据库采用 IndexedDB 来存储数据。IndexedDB 是一个浏览器端的数据库，它提供了一个对象存储的解决方案，可以存储大量的结构化数据。

> 关于 IndexedDB，本扩展使用了 [Dexie.js](https://dexie.org/) 这个库来进行 IndexedDB 的操作。

## 新增新的数据库

在 `src/database/tables` 目录下新增一个新的数据库，例如 `src/database/person.d.ts`。

```ts
import { Table } from 'dexie'
import { CommonSchema } from '~database'

declare module '~database' {
    interface IndexedDatabase {
        persons: Table<Person, number>
    }
}

interface Person extends CommonSchema {
    name: string
    age: number
    nickname?: string
}
```

完成后，你需要到 `src/database/migration.ts` 建立新版本迁移，然后添加你的数据库创建。

```ts
import type Dexie from "dexie"
import { commonSchema } from '~database'

export default function (db: Dexie) {
    // version 1
    db.version(1).stores({
        superchats: commonSchema + "text, scId, backgroundColor, backgroundImage, backgroundHeaderColor, userIcon, nameColor, uid, uname, price, message, hash, timestamp",
        jimakus: commonSchema + "text, uid, uname, hash"
    })

    db.version(2).stores({
        persons: commonSchema + "name, age, nickname"
    })
}
```

> 关于 Migrate 使用方式，请参考 [Dexie.js 的文档](https://dexie.org/docs/Tutorial/Understanding-the-basics#changing-a-few-tables-only)

## 使用

完成后，使用只需要使用 `src/database` 的 `db` 即可。

```ts
import { db } from '~database'

// 执行数据库操作
async function addPerson(){
    await db.persons.add({ name: 'world', age: 99 })
}

```

> 有关使用方式，还是请参考 [Dexie.js 的文档](https://dexie.org/docs/Collection/Collection)

