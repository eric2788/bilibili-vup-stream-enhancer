export function dispatchBjfEvent(event: string, detail: any) {
    window.dispatchEvent(new CustomEvent(`bjf:${event}`, { detail }))
}

export function addBjfEventListener(event: string, callback: (detail: any, e: CustomEvent) => void, once: boolean = false) {
    const listener = (e: CustomEvent) => {
        callback(e.detail, e)
        if (once) window.removeEventListener(`bjf:${event}`, listener)
    }
    window.addEventListener(`bjf:${event}`, listener)
}

export function dispatchFuncEvent(func: string, ...args: any[]) {
    window.dispatchEvent(new CustomEvent(`bjf:func:${func}`, { detail: args }))
}


export function injectFuncAsListener(func: (...args: any[]) => void) {
    addFuncEventListener(func.name, func)
}

export function addFuncEventListener(func: string, callback: (...args: any[]) => void, once: boolean = false) {
    const listener = (e: CustomEvent) => {
        callback(...e.detail)
        if (once) window.removeEventListener(`bjf:func:${func}`, listener)
    }
    window.addEventListener(`bjf:func:${func}`, listener)
}