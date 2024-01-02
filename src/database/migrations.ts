import type Dexie from "dexie"
import { commonSchema } from '~database'

export default function (db: Dexie) {
    // version 1
    db.version(1).stores({
        superchats: commonSchema + "text, scId, backgroundColor, backgroundImage, backgroundHeaderColor, userIcon, nameColor, uid, uname, price, message, hash, timestamp",
        jimakus: commonSchema + "text, uid, uname, hash"
    })
}