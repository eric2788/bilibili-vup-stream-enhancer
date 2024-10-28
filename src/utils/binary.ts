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


/**
 * Serializes a Blob object as a Base64-encoded string.
 *
 * This function reads the content of the provided Blob object and converts it
 * into a Base64-encoded string. It uses the FileReader API to read the Blob
 * and returns a promise that resolves with the Base64 string.
 *
 * @param {Blob} blob - The Blob object to be serialized.
 * @returns {Promise<string>} A promise that resolves with the Base64-encoded string representation of the Blob content.
 *
 * @example
 * ```typescript
 * const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
 * serializeBlobAsString(blob).then(base64String => {
 *     console.log(base64String);
 * });
 * ```
 */
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

/**
 * Deserializes a base64 encoded string into a Blob object.
 *
 * @param base64 - The base64 encoded string to be deserialized.
 * @returns A Blob object representing the binary data.
 */
export function deserializeStringToBlob(base64: string): Blob {
    const byteString = atob(base64);
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray])
}


/**
 * Serializes the content of a Blob as an array of numbers.
 *
 * This function reads the content of the provided Blob and converts it into an array of numbers,
 * where each number represents a byte from the Blob's content.
 *
 * @param {Blob} blob - The Blob object to be serialized.
 * @returns {Promise<number[]>} A promise that resolves to an array of numbers representing the Blob's content.
 *
 * @example
 * ```typescript
 * const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
 * serializeBlobAsNumbers(blob).then(numbers => {
 *     console.log(numbers); // [72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]
 * });
 * ```
 */
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

/**
 * Converts an array of numbers into a Blob object.
 *
 * @param numbers - An array of numbers to be converted into a Blob.
 * @returns A Blob object containing the binary data from the input numbers.
 */
export function deserializeNumbersToBlob(numbers: number[]): Blob {
    const buffer = new Uint8Array(numbers)
    return new Blob([buffer])
}

/**
 * Captures a screenshot from a given HTMLVideoElement and returns it as a Blob.
 *
 * @param media - The HTMLVideoElement from which to capture the screenshot.
 * @returns A Promise that resolves to a Blob containing the screenshot in JPEG format.
 */
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

/**
 * Converts an `ArrayBufferLike` object to an `ArrayBuffer`.
 * If the input is already an `ArrayBuffer`, it is returned as is.
 * If the input is a `SharedArrayBuffer`, it creates a new `ArrayBuffer`
 * and copies the contents of the `SharedArrayBuffer` into it.
 *
 * @param like - The `ArrayBufferLike` object to convert.
 * @returns The converted `ArrayBuffer`.
 */
export function toArrayBuffer(like: ArrayBufferLike): ArrayBuffer {
    if (like instanceof ArrayBuffer) {
        return like
    }
    console.debug('converting SharedArrayBuffer to ArrayBuffer')
    const arr = new Uint8Array(new ArrayBuffer(like.byteLength))
    arr.set(new Uint8Array(like), 0)
    return arr.buffer
}

/**
 * Parses Server-Sent Events (SSE) responses from a readable stream and yields each response as a string.
 *
 * @param reader - The readable stream reader that provides the SSE data as `Uint8Array`.
 * @param endStr - An optional string that, when encountered, will stop the parsing and break the loop.
 * @returns An async generator that yields each parsed SSE response as a string.
 * 
 * @example
 * ```typescript
 * const reader = new ReadableStreamDefaultReader<Uint8Array>(/* some readable stream * /);
 * const endStr = 'end';
 * 
 * for await (const response of parseSSEResponses(reader, endStr)) {
 *     console.log(response);
 * }
 * ```
 * 
 * @throws Will throw an error if the JSON parsing fails.
 */
export async function* parseSSEResponses(reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>, endStr?: string): AsyncGenerator<string> {
    const decoder = new TextDecoder('utf-8', { ignoreBOM: true })
    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const decoded = decoder.decode(value, { stream: true })
        const textValues = decoded.split('\n\n') // sometimes it will fetch multiple lines
        for (const textValue of textValues) {
            if (textValue.trim() === '') continue
            if (!textValue.startsWith('data:')) continue
            const jsonValue = textValue.slice(5).trim()
            if (endStr && jsonValue === endStr) break
            try {
                const { response } = JSON.parse(jsonValue)
                yield response
            } catch (err) {
                throw new Error(`error while parsing '${jsonValue}': ${err.message ?? err}`)
            }
        }
    }
}