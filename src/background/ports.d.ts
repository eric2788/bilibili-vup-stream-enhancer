// follow from ./ports/*.ts
import * as blacklist from "./ports/blacklist";
import * as jimaku from "./ports/jimaku";

export interface PortingData {
    'blacklist': blacklist.RequestBody,
    'jimaku': jimaku.RequestBody
}