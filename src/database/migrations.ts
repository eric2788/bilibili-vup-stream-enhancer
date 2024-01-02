import type Dexie from "dexie";
import { commonSchema } from '~database';

export default function (db: Dexie) {
    // version 1
    db.version(1).stores({
        superchats: commonSchema + "text, color, price, hash, uname, uid",
        jimakus: commonSchema + "text, uid, uname, hash"
    })
}