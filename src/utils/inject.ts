import type { InjectableFunction, InjectableFunctionParameters, InjectableFunctionReturnType, InjectableFunctionType } from "~background/functions"
import type { RequestBody } from "~background/messages/hook-adapter"
import type { InjectableScript, InjectableScriptParameters, InjectableScriptReturnType, InjectableScriptType } from "~background/scripts"
import { sendMessager } from './messaging'

export class InjectScript<T extends InjectableScriptType> implements InjectableScript<T> {

    constructor(public name: T, ...args: InjectableScriptParameters<T>) {
        this.args = args
    }

    args: InjectableScriptParameters<T>
}

export class InjectFunction<T extends InjectableFunctionType> implements InjectableFunction<T> {

    constructor(public name: T, ...args: InjectableFunctionParameters<T>) {
        this.args = args
    }

    args: InjectableFunctionParameters<T>

}


export async function injectAdapter(body: RequestBody): Promise<void> {
    const res = await sendMessager('hook-adapter', body)
    if (!res) return
    if (!res.success) {
        throw new Error(res.error ?? 'unknown')
    }
}


export async function injectScript<T extends InjectableScriptType>(name: T, ...args: InjectableScriptParameters<T>): Promise<InjectableScriptReturnType<T>> {
    const res = await sendMessager('inject-script', { script: new InjectScript(name, ...args) })
    if (!res) return
    if (!res.success) {
        throw new Error(res.error ?? 'unknown')
    } else {
        return res.result
    }
}

export async function injectFunction<T extends InjectableFunctionType>(name: T, ...args: InjectableFunctionParameters<T>): Promise<InjectableFunctionReturnType<T>> {
    const res = await sendMessager('inject-func', { function: new InjectFunction(name, ...args) })
    if (!res[0]?.result) return
    if (res[0].result?.error) {
        throw new Error(res[0].result.error)
    }
    return res[0].result
}