import clearIndexedDbTable from "./clearIndexedDbTable";
import clearIndexedDbTableUrl from "url:./clearIndexedDbTable";

export interface InjectableScript<T extends InjectableScriptType> {
    url: string
    name: T
    args: InjectableScriptParameters<T>
}

export type InjectableScripts = typeof scripts

export type InjectableScriptType = keyof InjectableScripts

export type InjectableScriptParameters<T extends InjectableScriptType> = Parameters<InjectableScripts[T]['prototype']>

export type InjectableScriptReturnType<T extends InjectableScriptType> = ReturnType<InjectableScripts[T]['prototype']>

export function injectScript<T extends InjectableScriptType>(name: T, ...args: InjectableScriptParameters<T>): InjectableScript<T> {
    return {
        name,
        args,
        url: scripts[name].url
    }
}

const scripts = {
    clearIndexedDbTable: {
        prototype: clearIndexedDbTable,
        url: clearIndexedDbTableUrl
    }
}

export default scripts