import type Dexie from "dexie";

import jimakuSchema from "./tables/jimaku";
import superChatSchema from "./tables/superchat";

import { commonSchema } from "~database";

export default function (db: Dexie) {
    // version 1
    db.version(1).stores({
        superchat: commonSchema + superChatSchema,
        jimaku: commonSchema + jimakuSchema
    })
    // version 2 ?
}