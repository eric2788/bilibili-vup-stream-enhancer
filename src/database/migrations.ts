import type Dexie from "dexie";
import { commonSchema } from "~database";

export default function (db: Dexie) {
    // version 1
    db.version(1).stores({
        superchat: commonSchema + "text, color, price, sender",
        jimaku: commonSchema + "text, sender"
    })
}