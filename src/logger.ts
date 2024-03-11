
function ciOnly(func: any) {
    return function (...data: any[]) {
        if (process.env.CI || process.env.NODE_ENV === 'development') {
            func(...data)
        }
    }
}


console.info = console.info.bind(console, '[bilibili-vup-stream-enhancer]')
console.warn = console.warn.bind(console, '[bilibili-vup-stream-enhancer]')
console.error = console.error.bind(console, '[bilibili-vup-stream-enhancer]')
console.log = console.log.bind(console, '[bilibili-vup-stream-enhancer]')
console.debug = ciOnly(console.debug.bind(console, '[bilibili-vup-stream-enhancer]'))
console.trace = ciOnly(console.trace.bind(console, '[bilibili-vup-stream-enhancer]'))