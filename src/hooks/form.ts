import { useCallback, useRef } from "react";

export function useFileInput(onFileChange: (files: FileList) => Promise<void>, onError?: (e: Error | any) => void, deps: any[] = []) {

    const inputRef = useRef<HTMLInputElement>()
    const selectFiles = useCallback(function (): Promise<void> {
        return new Promise((resolve, reject) => {
            const finallize = () => {
                inputRef.current.removeEventListener('change', listener)
                inputRef.current.removeEventListener('cancel', finallize)
                inputRef.current.files = null
                resolve()
            }
            const listener = async (e: Event) => {
                try {
                    const files = (e.target as HTMLInputElement).files
                    if (files.length === 0) return
                    await onFileChange(files)
                } catch (e: Error | any) {
                    console.error(e)
                    onError?.(e)
                    reject(e)
                } finally {
                    finallize()
                }
            }
            inputRef.current.addEventListener('change', listener)
            inputRef.current.addEventListener('cancel', finallize)
            inputRef.current.click()
        })
    }, deps)

    return {
        inputRef,
        selectFiles,
    }
}