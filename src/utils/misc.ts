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