import { useCallback, useRef } from "react";

/**
 * Custom hook to handle file input selection and processing.
 *
 * @param onFileChange - Callback function that processes the selected files. It should return a Promise.
 * @param onError - Optional callback function to handle errors during file processing.
 * @param deps - Dependency array for the `useCallback` hook.
 *
 * @returns An object containing:
 * - `inputRef`: A reference to the file input element.
 * - `selectFiles`: A function to trigger the file input dialog and handle file selection.
 *
 * @example
 * ```typescript
 * const { inputRef, selectFiles } = useFileInput(
 *   async (files) => {
 *     // Process the files
 *     console.log(files);
 *   },
 *   (error) => {
 *     // Handle the error
 *     console.error(error);
 *   }
 * );
 *
 * // To trigger file selection
 * selectFiles();
 * ```
 */
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