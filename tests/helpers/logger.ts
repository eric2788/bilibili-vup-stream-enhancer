
export interface Logger {
    info: (...args: any[]) => void
    log: (...args: any[]) => void
    warn: (...args: any[]) => void
    error: (...args: any[]) => void
    debug: (...args: any[]) => void
    trace: (...args: any[]) => void
}

export default class LoggerImpl implements Logger {

    private static void = () => {}

    readonly info: (...args: any[]) => void
    readonly log: (...args: any[]) => void
    readonly warn: (...args: any[]) => void
    readonly error: (...args: any[]) => void
    readonly debug: (...args: any[]) => void
    readonly trace: (...args: any[]) => void

    constructor(ci: boolean = false) {
        this.info = !ci ? console.info : LoggerImpl.void
        this.log = !ci ? console.log : LoggerImpl.void
        this.warn = !ci ? console.warn : LoggerImpl.void
        this.error = !ci ? console.error : LoggerImpl.void
        this.debug = !ci ? console.debug : LoggerImpl.void
        this.trace = !ci ? console.trace : LoggerImpl.void
    }

}