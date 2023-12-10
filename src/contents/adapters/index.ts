//TODO: import js files from adapters folder




export interface Adapters {
    'dom': {},
    'websocket': {},
}


export type AdapterType = keyof Adapters