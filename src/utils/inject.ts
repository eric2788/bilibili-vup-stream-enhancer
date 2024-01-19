import type { InjectableFunction, InjectableFunctionParameters, InjectableFunctionReturnType, InjectableFunctionType } from "~background/functions"
import type { RequestBody } from "~background/messages/hook-adapter"
import type { InjectableScript, InjectableScriptParameters, InjectableScriptReturnType, InjectableScriptType } from "~background/scripts"
import { sendMessager } from './messaging'

/**
 * Represents a script that can be injected using the Chrome Scripting API.
 * @template T - The type of the injectable script.
 */
export class InjectScript<T extends InjectableScriptType> implements InjectableScript<T> {

    /**
     * Creates a new instance of the InjectScript class.
     * @param name - The name of the injectable script.
     * @param args - The arguments for the injectable script.
     */
    constructor(public name: T, ...args: InjectableScriptParameters<T>) {
        this.args = args
    }

    /**
     * The arguments for the injectable script.
     */
    args: InjectableScriptParameters<T>
}

/**
 * Represents a function that can be injected into a Chrome extension using the chrome.scripting API.
 * @template T - The type of the injectable function.
 */
export class InjectFunction<T extends InjectableFunctionType> implements InjectableFunction<T> {

    /**
     * Creates a new instance of the InjectFunction class.
     * @param name - The name of the injectable function.
     * @param args - The arguments to be passed to the injectable function.
     */
    constructor(public name: T, ...args: InjectableFunctionParameters<T>) {
        this.args = args
    }

    /**
     * The arguments to be passed to the injectable function.
     */
    args: InjectableFunctionParameters<T>

}


/**
 * Injects an adapter by sending a message to the 'hook-adapter' channel.
 * 
 * @param body The request body to be sent.
 * @returns A promise that resolves when the adapter is successfully injected.
 * @throws An error if the injection fails.
 */
export async function injectAdapter(body: RequestBody): Promise<void> {
    const res = await sendMessager('hook-adapter', body)
    if (!res) return
    if (!res.success) {
        throw new Error(res.error ?? 'unknown')
    }
}


/**
 * Injects a script into the page.
 * 
 * @param name - The name of the script to inject.
 * @param args - The arguments to pass to the script.
 * @returns A promise that resolves to the return value of the injected script.
 * @throws An error if the injection fails.
 */
export async function injectScript<T extends InjectableScriptType>(name: T, ...args: InjectableScriptParameters<T>): Promise<InjectableScriptReturnType<T>> {
    const res = await sendMessager('inject-script', { script: new InjectScript(name, ...args) })
    if (!res) return
    if (!res.success) {
        throw new Error(res.error ?? 'unknown')
    } else {
        return res.result
    }
}

/**
 * Injects a function into the application.
 * 
 * @param name - The name of the function to inject.
 * @param args - The arguments to pass to the injected function.
 * @returns A promise that resolves to the return value of the injected function.
 * @throws An error if the injection fails or if the injected function throws an error.
 */
export async function injectFunction<T extends InjectableFunctionType>(name: T, ...args: InjectableFunctionParameters<T>): Promise<InjectableFunctionReturnType<T>> {
    const res = await sendMessager('inject-func', { function: new InjectFunction(name, ...args) })
    if (!res[0]?.result) return
    if (res[0].result?.error) {
        throw new Error(res[0].result.error)
    }
    return res[0].result
}