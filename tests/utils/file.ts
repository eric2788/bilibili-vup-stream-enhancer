import { glob, type GlobOptions as IOptions } from 'glob'
import type { Readable } from 'stream'


export type IModule = {
    name: string,
    file: string,
    module: any
}

// Imporntant!!! Only Node.js can use this function.
export function getTSFiles(dirPath: string, options?: IOptions): string[] {
    return glob.sync(`${dirPath}/**/*.{ts,tsx}`, options) as string[]
}


// Imporntant!!! Only Node.js can use this function.
export function* getModuleStream(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<Promise<IModule>, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        const name = file.split('/').pop().split('.')[0]
        yield import(file).then(module => ({ name, file, module }))
    }
}



// Imporntant!!! Only Node.js can use this function.
export function* getModuleStreamSync(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<IModule, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        const name = file.split('/').pop().split('.')[0]
        yield { name, file, module: require(file) }
    }
}


export async function readText(readable: Readable): Promise<string> {
    return new Promise((res, rej) => {
        let data = ''
        readable.on('data', chunk => data += chunk)
        readable.on('end', () => res(data))
        readable.on('error', rej)
    })
}