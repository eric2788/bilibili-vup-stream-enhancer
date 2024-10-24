import { useCallback, useRef } from "react";

export function useFileInput(onFileChange: (files: FileList) => Promise<void>, onError?: (e: Error | any) => void, deps: any[] = []) {

    const inputRef = useRef<HTMLInputElement>()
    const selectFiles = useCallback(function (): Promise<void> {
        return new Promise((resolve, reject) => {
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
                    inputRef.current.removeEventListener('change', listener)
                    inputRef.current.files = null
                    resolve()
                }
            }
            inputRef.current.addEventListener('change', listener)
            inputRef.current.click()
        })
    }, deps)

    return {
        inputRef,
        selectFiles,
    }
}