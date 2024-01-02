// follow from ./ports/*.ts
import * as blacklist from "./ports/blacklist";

export interface PortingData {
    'blacklist': blacklist.RequestBody
}