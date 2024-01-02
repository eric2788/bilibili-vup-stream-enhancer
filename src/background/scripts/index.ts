
import clearIndexedDbTable from './clearIndexedDbTable';
import testOnly from './testOnly';

export interface InjectableScript<T extends InjectableScriptType> {
    name: T
    args: InjectableScriptParameters<T>
}

export type InjectableScripts = typeof scripts

export type InjectableScriptType = keyof InjectableScripts

export type InjectableScriptParameters<T extends InjectableScriptType> = Parameters<InjectableScripts[T]['prototype']>

export type InjectableScriptReturnType<T extends InjectableScriptType> = ReturnType<InjectableScripts[T]['prototype']>

export function getScriptUrl<T extends InjectableScriptType>(script: InjectableScript<T>): string {
    return scripts[script.name].url
}

// TODO: make prototype but without getManifest error
const scripts = {
    clearIndexedDbTable,
    testOnly
}

export default scripts