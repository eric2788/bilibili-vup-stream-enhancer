export async function dispatchFuncEvent(func: string, ...args: any[]): Promise<void> {
    const id = Math.random().toString(36).slice(2)
    return new Promise((res, rej) => {
        const callbackListener = (e: CustomEvent) => {
            window.removeEventListener(`bjf:func:callback:${id}`, callbackListener)
            res()
        }
        window.addEventListener(`bjf:func:callback:${id}`, callbackListener)
        // 60s timeout
        setTimeout(() => {
            window.removeEventListener(`bjf:func:callback:${id}`, callbackListener)
            rej(`執行函數${func}逾時`)
        }, 60000)
        window.dispatchEvent(new CustomEvent(`bjf:func:${func}`, { detail: { args, id } }))
    })
}


export function injectFuncAsListener(func: (...args: any[]) => void | Promise<void>) {
    addFuncEventListener(func.name, func)
}

export function addFuncEventListener(func: string, callback: (...args: any[]) => void | Promise<void>, once: boolean = false) {
    const listener = async (e: CustomEvent) => {
        try {
            const res = callback(...e.detail.args)
            if (res instanceof Promise) {
               await res
            }
        } catch (err: Error | any) {
            console.error(`函數${func}執行時出現錯誤`, err)
        } finally {
            if (once) window.removeEventListener(`bjf:func:${func}`, listener)
            window.dispatchEvent(new CustomEvent(`bjf:func:callback:${e.detail.id}`))
        }
    }
    window.addEventListener(`bjf:func:${func}`, listener)
}