

export type FuncEventResult = {
    success: boolean
    error?: string
}


export function isFuncEventResult(obj: any): obj is FuncEventResult {
    return typeof obj === 'object' && typeof obj?.success === 'boolean'
}

/**
 * Dispatches a function event and returns a promise that resolves with the result.
 * @param func The name of the function to be executed.
 * @param args The arguments to be passed to the function.
 * @returns A promise that resolves with the result of the function execution.
 */
export function dispatchFuncEvent(func: string, ...args: any[]): Promise<FuncEventResult> {
    const id = window.crypto.randomUUID()
    return new Promise<FuncEventResult>((res) => {
        const callbackListener = (e: CustomEvent) => {
            window.removeEventListener(`bjf:func:callback:${id}`, callbackListener)
            res(e.detail)
        }
        window.addEventListener(`bjf:func:callback:${id}`, callbackListener)
        // 60s timeout
        setTimeout(() => {
            window.removeEventListener(`bjf:func:callback:${id}`, callbackListener)
            res({ success: false, error: `執行函數 ${func} 逾時` })
        }, 60000)
        window.dispatchEvent(new CustomEvent(`bjf:func:${func}`, { detail: { args, id } }))
    })
}


/**
 * Injects a function as a listener.
 * 
 * @param func - The function to be injected as a listener.
 */
export function injectFuncAsListener(func: (...args: any[]) => void | Promise<void>) {
    addFuncEventListener(func.name, func)
}

/**
 * Adds a function event listener.
 * 
 * @param func - The name of the function.
 * @param callback - The callback function to be executed when the event is triggered.
 * @param once - Optional. Specifies whether the listener should be removed after being triggered once. Default is false.
 */
export function addFuncEventListener(func: string, callback: (...args: any[]) => void | Promise<void>, once: boolean = false) {
    const listener = async (e: CustomEvent) => {
        try {
            const res = callback(...e.detail.args)
            if (res instanceof Promise) {
                await res
            }
            window.dispatchEvent(new CustomEvent(`bjf:func:callback:${e.detail.id}`, { detail: { success: true } }))
        } catch (err: Error | any) {
            console.error(`函數${func}執行時出現錯誤`, err)
            window.dispatchEvent(new CustomEvent(`bjf:func:callback:${e.detail.id}`, { detail: { success: false, error: err.toString() } }))
        } finally {
            if (once) window.removeEventListener(`bjf:func:${func}`, listener)
        }
    }
    window.addEventListener(`bjf:func:${func}`, listener)
}