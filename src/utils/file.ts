export function download(filename: string, content: string, type: string = 'text/plain') {
    const a = document.createElement('a')
    const file = new Blob([content], { type })
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}