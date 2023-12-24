import type { Settings } from "~settings"

//TODO: import js files from adapters folder



export interface Adapters {
    'dom': {},
    'websocket': {},
}


export type AdapterType = keyof Adapters


async function hookAdapter(settings: Settings) {

}



export default hookAdapter