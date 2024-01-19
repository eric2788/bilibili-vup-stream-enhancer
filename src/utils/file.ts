/**
 * Downloads a file with the specified filename, content, and type.
 * @param filename - The name of the file to be downloaded.
 * @param content - The content of the file.
 * @param type - The MIME type of the file. Defaults to 'text/plain'.
 */
export function download(filename: string, content: string, type: string = 'text/plain') {
    const a = document.createElement('a')
    const file = new Blob([content], { type })
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}


/**
 * Reads a file as JSON and returns a promise that resolves with the parsed JSON object.
 * @param file - The file to read.
 * @returns A promise that resolves with the parsed JSON object.
 */
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

/**
 * Checks if the code is running in the background script.
 * @returns A boolean value indicating whether the code is running in the background script.
 */
export function isBackgroundScript(): boolean {
    return chrome.tabs !== undefined
}

/**
 * Extracts the resource name from a URL.
 * @param url - The URL from which to extract the resource name.
 * @returns The extracted resource name.
 */
export function getResourceName(url: string): string {
    return url.split('/').pop().split('?')[0]
}