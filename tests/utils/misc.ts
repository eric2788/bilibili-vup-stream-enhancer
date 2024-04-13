


/**
 * Returns a random item from the given array.
 * @param items - The array of items.
 * @returns A random item from the array.
 */
export function random<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
}


/**
 * A class that provides different strategies for generating values.
 */
export class Strategy {

    /**
     * Generates a random sequence of values from an array.
     * @param items - The array of items to generate values from.
     * @param limit - The maximum number of values to generate (default: items.length).
     * @returns A generator that yields random values from the array.
     */
    static *random<T>(items: T[], limit: number = items.length): Generator<T> {
        const remains = [...items]
        let count = 0
        while (remains.length) {
            const random = Math.floor(Math.random() * remains.length)
            yield remains.splice(random, 1)[0]
            if (++count >= limit) break
        }
    }

    /**
     * Generates a serial sequence of values from an array.
     * @param items - The array of items to generate values from.
     * @param limit - The maximum number of values to generate (default: items.length).
     * @returns A generator that yields serial values from the array.
     */
    static *serial<T>(items: T[], limit: number = items.length): Generator<T> {
        for (const item of items.toSpliced(limit)) {
            yield item
        }
    }

}


/**
 * Retrieves the value of an environment variable and converts it to the specified type.
 * @param name - The name of the environment variable.
 * @param convert - A function that converts the environment variable value to the desired type.
 * @returns The converted value of the environment variable, or `undefined` if the variable is not defined.
 * @template T - The type to convert the environment variable value to.
 */
export function env<T>(name: string, convert: (s: string) => T): T {
    const value = process.env[name]
    if (value === undefined) return undefined
    return convert(value)
}

/**
 * Retrieves the string value of the specified environment variable.
 * @param name - The name of the environment variable.
 * @returns The string value of the environment variable.
 */
export function envStr(name: string): string {
    return env(name, String)
}

/**
 * Retrieves the integer value of the specified environment variable.
 * @param name - The name of the environment variable.
 * @returns The integer value of the environment variable.
 */
export function envInt(name: string): number {
    return env(name, Number)
}

/**
 * Retrieves the boolean value of the specified environment variable.
 * @param name - The name of the environment variable.
 * @returns The boolean value of the environment variable.
 */
export function envBool(name: string): boolean {
    return env(name, Boolean)
}

/**
 * Generates a random number with the specified length.
 * @param length The length of the random number. Defaults to 20.
 * @returns The generated random number.
 */
export function randomNumber(length: number = 20): number {
    return Math.round(Math.random() * (10 ** length))
}


/**
 * Creates a deferred execution object.
 * @param run - The function to be executed when the deferred object is disposed.
 * @returns An object with a `dispose` method that can be used to execute the deferred function.
 */
export function defer(run: () => void): { [Symbol.dispose]: () => void } {
    return {
        [Symbol.dispose]: run
    }
}

/**
 * Creates a deferred async function.
 * @param run - The async function to be executed.
 * @returns An object with an asyncDispose method that can be used to dispose the async function.
 */
export function deferAsync(run: () => Promise<void>): { [Symbol.asyncDispose]: () => Promise<void> } {
    return {
        [Symbol.asyncDispose]: run
    }
}


/**
 * Shuffles the items in an array.
 * 
 * @param items - The array of items to be shuffled.
 * @returns The shuffled array.
 */
export function shuffle<T>(items: T[]): T[] {
    const shuffled = [...items]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = temp
    }
    return shuffled
}