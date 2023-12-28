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
    const listener = (e: CustomEvent) => {
        const res = callback(...e.detail.args)

        const afterRun = () => {
            if (once) window.removeEventListener(`bjf:func:${func}`, listener)
            window.dispatchEvent(new CustomEvent(`bjf:func:callback:${e.detail.id}`))
        }

        if (res instanceof Promise) {
            res.finally(afterRun)
        } else {
           afterRun()
        }
    }
    window.addEventListener(`bjf:func:${func}`, listener)
}