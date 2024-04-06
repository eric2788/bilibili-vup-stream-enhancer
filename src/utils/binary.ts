/**
 * Formats the given number of bytes into a human-readable string representation.
 * @param bytes The number of bytes to format.
 * @returns A string representing the formatted bytes.
 */
export function formatBytes(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    if (bytes == 0) {
        return "0 Bytes"
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024))

    if (i == 0) {
        return bytes + " " + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i]
}


/**
 * Splits a Blob into multiple smaller Blobs of a specified chunk size.
 * 
 * @param blob - The Blob to be split.
 * @param chunkSize - The size of each chunk in bytes.
 * @returns An array of Blobs, each representing a chunk of the original Blob.
 */
export function splitBlob(blob: Blob, chunkSize: number = 10 * 1024 * 1024): Blob[] {
    const chunks = []
    const size = blob.size
    let offset = 0
    while (offset < size) {
        const end = Math.min(offset + chunkSize, size)
        const chunk = blob.slice(offset, end, blob.type)
        chunks.push(chunk)
        offset += chunkSize
    }
    return chunks
}


export async function serializeBlobAsString(blob: Blob): Promise<string> {
    console.info('reading blob content with size: ', blob.size)
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve(base64);
        }
        reader.onerror = () => reject(reader.error) 
        reader.readAsDataURL(blob)
    });
}

export function deserializeStringToBlob(base64: string): Blob {
    const byteString = atob(base64);
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray])
}


export async function serializeBlobAsNumbers(blob: Blob): Promise<number[]> {
    console.info('reading blob content with size: ', blob.size)
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const buffer = new Uint8Array(reader.result as ArrayBuffer)
            resolve(Array.from(buffer))
        }
        reader.onerror = () => reject(reader.error) 
        reader.readAsArrayBuffer(blob)
    });
}

export function deserializeNumbersToBlob(numbers: number[]): Blob {
    const buffer = new Uint8Array(numbers)
    return new Blob([buffer])
}

export async function screenshotFromVideo(media: HTMLVideoElement): Promise<Blob> {
    const canvas = document.createElement('canvas')
    canvas.width = media.videoWidth
    canvas.height = media.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(media, 0, 0, canvas.width, canvas.height)
    return new Promise((res, rej) => {
        canvas.toBlob(res, 'image/jpeg')
        canvas.onerror = rej
    })
}