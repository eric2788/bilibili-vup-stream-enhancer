import clearIndexedDbTable from "url:./clearIndexedDbTable";
import test from 'url:./test'

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

// TODO: make prototype but without getManifest error
const scripts = {
    clearIndexedDbTable: {
        prototype: await import(clearIndexedDbTable),
        url: clearIndexedDbTable
    },
    test: {
        prototype: await import(test),
        url: test
    }
}

export default scripts