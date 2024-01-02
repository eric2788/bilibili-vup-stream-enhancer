import glob, { type IOptions } from 'glob'

export function getTSFiles(dirPath: string, options?: IOptions): string[] {
    return glob.sync(`${dirPath}/**/*.{ts,tsx}`, options)
}


export function download(filename: string, content: string, type: string = 'text/plain') {
    const a = document.createElement('a')
    const file = new Blob([content], { type })
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}


export type IModule = {
    name: string,
    file: string,
    module: any
}


export function *getModuleStream(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<Promise<IModule>, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        const name = file.split('/').pop().split('.')[0]
        yield import(file).then(module => ({ name, file, module }))
    }
}


export function *getModuleStreamSync(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<IModule, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        const name = file.split('/').pop().split('.')[0]
        yield { name, file, module: require(file) }
    }
}