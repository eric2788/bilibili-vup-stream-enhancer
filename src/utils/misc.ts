

export async function sleep(ms: number) {
    return new Promise((res,) => setTimeout(res, ms))
}

export function toTimer(secs: number): string {
    const hr = Math.floor(secs / 3600)
    secs %= 3600
    const min = Math.floor(secs / 60)
    secs %= 60

    const mu = min > 9 ? `${min}` : `0${min}`
    const ms = secs > 9 ? `${secs}` : `0${secs}`

    return `${hr}:${mu}:${ms}`
}


export function getRoomId(url: string = location.pathname) {
    return parseInt(/^\/(blanc\/)?(?<id>\d+)/g.exec(url)?.groups?.id)
}


export const isDarkTheme: () => boolean = () => matchMedia('(prefers-color-scheme: dark)').matches



export function removeArr<T>(arr: T[], item: T): boolean {
    const index = arr.findIndex(v => JSON.stringify(v) === JSON.stringify(item))
    console.info('removeArr', index, arr, item)
    if (index === -1) return false
    arr.splice(index, 1)
    console.info('removeArr', arr)
    return true
}

export function deepCopy<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T
}


export const setEqual = <T>(xs: Set<T>, ys: Set<T>) => xs.size === ys.size && [...xs].every((x) => ys.has(x));

export function arrayEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false
    const set1 = new Set<T>(arr1)
    const set2 = new Set<T>(arr2)
    return setEqual(set1, set2)
}

export function removeInvalidKeys<T>(obj: Record<string, any>, sample: T): T {
    const validKeys = Object.keys(sample) as (keyof T)[];
    Object.keys(obj).forEach((key) => {
        if (!validKeys.includes(key as keyof T)) {
            delete obj[key];
        }
    });
    return obj as T;
}