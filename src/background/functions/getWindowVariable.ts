
function getWindowVariable(key: string): any {
    const nested = key.split('.')
    if (nested.length === 1) return window[key]
    let current = window
    for (const k of nested) {
        current = current[k]
    }
    return current
}

export default getWindowVariable