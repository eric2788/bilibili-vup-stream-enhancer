import type { NumRange } from "~types/common"


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

export const isDarkTheme: () => boolean = () => matchMedia('(prefers-color-scheme: dark)').matches

export function removeArr<T>(arr: T[], item: T): boolean {
    const index = arr.findIndex(v => JSON.stringify(v) === JSON.stringify(item))
    if (index === -1) return false
    arr.splice(index, 1)
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

export function getTimeStamp(): string {
    return new Date().toTimeString().substring(0, 8)
}

export function toStreamingTime(live_time?: number): string {
    if (!live_time) {
        console.warn('獲取直播串流時間時出現錯誤，將改為獲取真實時間戳記')
        return getTimeStamp()
    }
    return toTimer(Math.round(Date.now() / 1000) - live_time)
}

export function rgba(hex: string, opacity: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity.toFixed(1)})`
    }
    console.warn('bad Hex: ' + hex)
    return hex
}

export function randomString(radix: NumRange<2, 36> = 16): string {
    return Math.random().toString(radix).slice(2)
}

export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomNumber(length: number = 20): number {
    return Math.round(Math.random() * (10**length))
}