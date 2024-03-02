import { env } from "@tests/utils/misc";
import { createLogger, type Logger } from "../logger";
import { isClosed, type PageFrame } from "../page-frame";

export abstract class PageListener {

    protected readonly logger: Logger
    protected instance: NodeJS.Timeout | null = null

    constructor(name: string, private readonly interval: number = 1000) {
        this.logger = createLogger(name, env('CI', Boolean))
    }

    start(content: PageFrame): void {

        if (this.instance) {
            this.logger.info('clear last interval')
            clearInterval(this.instance)
        }

        if (content === null) {
            this.logger.warn('content is null, cannot start listener')
            return
        }

        this.instance = setInterval(() => {

            if (isClosed(content)) {
                this.logger.info('frame/page is closed, listener aborted')
                clearInterval(this.instance)
                return
            }

            this.run(content)
                .catch(err => this.logger.warn('listener error: ', err))

        }, this.interval)
    }

    protected abstract run(content: PageFrame): Promise<void>

    stop(): void {
        if (this.instance) {
            clearInterval(this.instance)
            this.instance = null
        }
    }
}