

export function random<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
}


export class Strategy {

    static *random<T>(items: T[], limit: number = items.length): Generator<T> {
        const remains = [ ...items ]
        let count = 0
        while(remains.length) {
            const random = Math.floor(Math.random() * remains.length)
            yield remains.splice(random, 1)[0]
            if (++count >= limit) break
        }
    }

    static *serial<T>(items: T[], limit: number = items.length): Generator<T> {
        for (const item of items.toSpliced(limit)) {
            yield item
        }
    }

}