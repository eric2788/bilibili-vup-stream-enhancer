import { env } from "@tests/utils/misc";
import { createLogger, type Logger } from "../logger";
import { isClosed, type PageFrame } from "../page-frame";

/**
 * 页面监听器的抽象基类。
 */
export abstract class PageListener {

    protected readonly logger: Logger
    protected instance: NodeJS.Timeout | null = null

    /**
     * 创建一个页面监听器实例。
     * @param name 监听器的名称。
     * @param interval 监听器执行的时间间隔，默认为 1000 毫秒。
     */
    constructor(name: string, private readonly interval: number = 1000) {
        this.logger = createLogger(name, env('CI', Boolean))
    }

    /**
     * 启动监听器并开始监听页面内容。
     * @param content 页面的内容。
     */
    start(content: PageFrame): void {

        if (this.instance) {
            this.logger.info('清除上一个时间间隔')
            clearInterval(this.instance)
        }

        if (content === null) {
            this.logger.warn('内容为空，无法启动监听器')
            return
        }

        this.instance = setInterval(() => {

            if (isClosed(content)) {
                this.logger.info('帧/页面已关闭，监听器中止')
                clearInterval(this.instance)
                return
            }

            this.run(content)
                .catch(err => this.logger.warn('监听器错误: ', err))

        }, this.interval)
    }

    /**
     * 在子类中实现的方法，用于执行监听器的逻辑。
     * @param content 页面的内容。
     */
    protected abstract run(content: PageFrame): Promise<void>

    /**
     * 停止监听器。
     */
    stop(): void {
        if (this.instance) {
            clearInterval(this.instance)
            this.instance = null
        }
    }
}