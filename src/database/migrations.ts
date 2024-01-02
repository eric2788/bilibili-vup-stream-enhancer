import type Dexie from "dexie";
import { commonSchema } from '~database';

export default function (db: Dexie) {
    // version 1
    db.version(1).stores({
        superchats: commonSchema + "text, color, price, sender",
        jimakus: commonSchema + "text, sender"
    })
}