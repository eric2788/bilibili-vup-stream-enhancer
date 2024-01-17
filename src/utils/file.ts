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

export function isBackgroundScript(): boolean {
    return chrome.tabs !== undefined
}

export function getResourceName(url: string): string {
    return url.split('/').pop().split('?')[0]
}