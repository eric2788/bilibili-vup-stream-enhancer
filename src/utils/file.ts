import { glob, type IOptions } from 'glob';

// Imporntant!!! Only Node.js can use this function.
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


export function readAsJson<T extends object>(file: File): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                resolve(JSON.parse(e.target.result as string) as T)
            } catch (err: Error | any) {
                reject(err)
            }
        }
        reader.onerror = (e) => reject(e)
        reader.readAsText(file, 'utf-8')
    })
}



export type IModule = {
    name: string,
    file: string,
    module: any
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

export function isBackgroundScript(): boolean {
    return chrome.tabs !== undefined
}



export function getResourceName(url: string): string {
    return url.split('/').pop().split('?')[0]
}