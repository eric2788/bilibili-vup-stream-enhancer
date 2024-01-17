import { glob, type IOptions } from 'glob'


export type IModule = {
    name: string,
    file: string,
    module: any
}

// Imporntant!!! Only Node.js can use this function.
export function getTSFiles(dirPath: string, options?: IOptions): string[] {
    return glob.sync(`${dirPath}/**/*.{ts,tsx}`, options)
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