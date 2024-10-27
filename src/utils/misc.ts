import type { Leaves, NumRange, PathLeafType } from "~types/common"


/**
 * Asynchronously pauses the execution for the specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export async function sleep(ms: number) {
    return new Promise((res,) => setTimeout(res, ms))
}

/**
 * Converts a number of seconds to a formatted timer string.
 * @param secs The number of seconds to convert.
 * @returns The formatted timer string in the format "hh:mm:ss".
 */
export function toTimer(secs: number): string {
    const hr = Math.floor(secs / 3600)
    secs %= 3600
    const min = Math.floor(secs / 60)
    secs %= 60

    const mh = hr > 9 ? `${hr}` : `0${hr}`
    const mu = min > 9 ? `${min}` : `0${min}`
    const ms = secs > 9 ? `${secs}` : `0${secs}`

    return `${mh}:${mu}:${ms}`
}

/**
 * Determines if the user's preferred color scheme is dark.
 * @returns {boolean} True if the user's preferred color scheme is dark, false otherwise.
 */
export const isDarkTheme: () => boolean = () => matchMedia('(prefers-color-scheme: dark)').matches

/**
 * Removes an item from an array.
 * @template T The type of the array elements.
 * @param {T[]} arr The array from which to remove the item.
 * @param {T} item The item to remove from the array.
 * @returns {boolean} Returns true if the item was successfully removed, false otherwise.
 */
export function removeArr<T>(arr: T[], item: T): boolean {
    const index = arr.findIndex(v => JSON.stringify(v) === JSON.stringify(item))
    if (index === -1) return false
    arr.splice(index, 1)
    return true
}

/**
 * Creates a deep copy of an object.
 * 
 * @template T - The type of the object.
 * @param obj - The object to be copied.
 * @returns A deep copy of the object.
 */
export function deepCopy<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T
}


/**
 * Checks if two sets are equal.
 * @param xs The first set.
 * @param ys The second set.
 * @returns True if the sets are equal, false otherwise.
 */
export const setEqual = <T>(xs: Set<T>, ys: Set<T>) => xs.size === ys.size && [...xs].every((x) => ys.has(x))

/**
 * Checks if two arrays are equal.
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns `true` if the arrays are equal, `false` otherwise.
 */
export function arrayEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false
    const set1 = new Set<T>(arr1)
    const set2 = new Set<T>(arr2)
    return setEqual(set1, set2)
}

/**
 * Removes invalid keys from an object based on a sample object.
 * @param obj - The object from which to remove invalid keys.
 * @param sample - The sample object used to determine valid keys.
 * @returns The object with invalid keys removed.
 */
export function removeInvalidKeys<T>(obj: Record<string, any>, sample: T): T {
    const validKeys = Object.keys(sample) as (keyof T)[]
    Object.keys(obj).forEach((key) => {
        if (!validKeys.includes(key as keyof T)) {
            delete obj[key]
        }
    })
    return obj as T
}

/**
 * Returns the current timestamp in the format "HH:MM:SS".
 * @returns {string} The current timestamp.
 */
export function getTimeStamp(): string {
    return new Date().toTimeString().substring(0, 8)
}

/**
 * Converts the live streaming time to a formatted string.
 * If the live_time parameter is not provided, it returns the current timestamp.
 * @param live_time - The live streaming time in seconds.
 * @returns The formatted string representing the live streaming time.
 */
export function toStreamingTime(live_time?: number): string {
    if (!live_time) {
        console.warn('獲取直播串流時間時出現錯誤，將改為獲取真實時間戳記')
        return getTimeStamp()
    }
    return toTimer(Math.round(Date.now() / 1000) - live_time)
}

/**
 * Converts a hexadecimal color code to an RGBA color code with the specified opacity.
 * @param hex - The hexadecimal color code.
 * @param opacity - The opacity value between 0 and 1.
 * @returns The RGBA color code with the specified opacity.
 */
export function rgba(hex: string, opacity: number): string {
    let c: any
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

/**
 * Generates a random string.
 * 
 * @param radix The base to use for representing the number as a string. Must be between 2 and 36.
 * @returns A random string.
 */
export function randomString(radix: NumRange<2, 36> = 16): string {
    return Math.random().toString(radix).slice(2)
}

/**
 * Generates a random number within a specified range.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random number within the specified range.
 */
export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generates a random number.
 * @param length The length of the random number. Default is 20.
 * @returns The generated random number.
 */
export function randomNumber(length: number = 20): number {
    return Math.round(Math.random() * (10 ** length))
}

/**
 * Assigns default values to an object by merging it with a defaults object.
 * If a property in the object is undefined, it will be replaced with the corresponding default value.
 * If a property is an object, the function will recursively assign defaults to its properties.
 * 
 * @param data - The object to assign defaults to.
 * @param defaults - The defaults object to merge with the data object.
 * @returns The object with default values assigned.
 */
export function assignDefaults<T extends object>(data: T, defaults: T): T {
    if (Array.isArray(data)) return data
    const newData = { ...data }
    Object.keys(defaults).forEach((key) => {
        if (newData[key] === undefined) {
            newData[key] = defaults[key]
        } else if (newData[key] instanceof Object) {
            newData[key] = assignDefaults(newData[key], defaults[key])
        }
    })
    return newData
}

// a function that allow to get value for nested object via path
export function getNestedValue<T extends object, K extends Leaves<T>>(obj: T, path: K): PathLeafType<T, K> {
    return path.split('.').reduce((o, p) => o[p], obj)
}

// a function that allow to set value for nested object via path
export function setNestedValue<T extends object, K extends Leaves<T>>(obj: T, path: K, value: any): void {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const lastObj = keys.reduce((o, p) => o[p], obj)
    lastObj[lastKey] = value
}



/**
 * Formats a version string by ensuring it follows the major.minor.patch format.
 * If there are additional segments beyond the patch version, they are appended
 * as a plus suffix.
 *
 * @param version - The version string to format.
 * @returns The formatted version string.
 *
 * @example
 * ```typescript
 * formatVersion("1.2.3"); // "1.2.3"
 * formatVersion("1.2.3.4"); // "1.2.3+4"
 * formatVersion("1.2.3.4.5"); // "1.2.3+45"
 * formatVersion("1.2"); // "1.2"
 * ```
 */
export function formatVersion(version: string): string {
    const digits = version.split('.')
    if (digits.length < 3) return version
    const [majar, minor, patch, ...noise] = digits
    return `${majar}.${minor}.${patch}${noise.length ? `+${noise.join('')}` : ''}`
}