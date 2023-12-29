import type { InjectableFunctionType, InjectableFunctionParameters } from "~background/functions"
import type { InjectableScriptType, InjectableScriptParameters, InjectableScript } from "~background/scripts"

export function injectScript<T extends InjectableScriptType>(name: T, ...args: InjectableScriptParameters<T>): InjectableScript<T> {
    return {
        name,
        args,
    }
}

export function injectFunction<T extends InjectableFunctionType>(name: T, ...args: InjectableFunctionParameters<T>) {
    return {
        name,
        args
    }
}