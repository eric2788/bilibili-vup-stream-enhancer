const debug = process.env.CI || process.env.NODE_ENV !== 'production'


console.info = console.info.bind(console, '[bilibili-vup-stream-enhancer]')
console.warn = console.warn.bind(console, '[bilibili-vup-stream-enhancer]')
console.error = console.error.bind(console, '[bilibili-vup-stream-enhancer]')
console.log = console.log.bind(console, '[bilibili-vup-stream-enhancer]')
console.debug = debug ? console.debug.bind(console, '[bilibili-vup-stream-enhancer]') : () => { }
console.trace = debug ? console.trace.bind(console, '[bilibili-vup-stream-enhancer]') : () => { }