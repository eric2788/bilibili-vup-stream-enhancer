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


export function *getModuleStream(dirPath: string, options: IOptions = { ignore: '**/index.ts' }): Generator<Promise<any>, void, any> {
    for (const file of getTSFiles(dirPath, options)) {
        yield import(file)
    }
}