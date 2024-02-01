
export interface Logger {
    info: (...args: any[]) => void
    log: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
    debug: (...args: any[]) => void
    trace: (...args: any[]) => void
}

class LoggerImpl implements Logger {

    private static void = () => { }

    readonly info: (...args: any[]) => void
    readonly log: (...args: any[]) => void
    readonly warn: (...args: any[]) => void
    readonly error: (...args: any[]) => void
    readonly debug: (...args: any[]) => void
    readonly trace: (...args: any[]) => void

    constructor(name: string, ci: boolean = false) {
        this.info = !ci ? console.info.bind(console, `[${name}]`) : LoggerImpl.void
        this.log = !ci ? console.log.bind(console, `[${name}]`) : LoggerImpl.void
        this.warn = !ci ? console.warn.bind(console, `[${name}]`) : LoggerImpl.void
        this.error = !ci ? console.error.bind(console, `[${name}]`) : LoggerImpl.void
        this.debug = !ci ? console.debug.bind(console, `[${name}]`) : LoggerImpl.void
        this.trace = !ci ? console.trace.bind(console, `[${name}]`) : LoggerImpl.void
    }

}

export function createLogger(name: string, ci: boolean = false): Logger {
    return new LoggerImpl(name, ci)
}

const logger = createLogger('bilibili-vup-stream-enhancer', !!process.env.CI && !process.env.DEBUG)

export default logger