import clearIndexedDbTable from './clearIndexedDbTable'

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

// getManifest error only happens on development environment
const scripts = {
    clearIndexedDbTable,
}

export default scripts