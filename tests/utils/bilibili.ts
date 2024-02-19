import logger from "@tests/helpers/logger";
import type { PageFrame } from "@tests/helpers/page-frame";

export function sendFakeBLiveMessage(content: PageFrame, cmd: string, command: object) {
    logger.debug('sending blive fake message into: ', cmd, content.url())
    return content.evaluate(([cmd, command]) => {
        const eventId = window.crypto.randomUUID()
        console.info(`[bilibili-vup-stream-enhancer-test] send fake blive message: ${cmd}`, command)
        window.postMessage({
            source: 'bilibili-vup-stream-enhancer',
            data: {
                command: 'blive-ws',
                body: { cmd, command, eventId }
            }
        }, '*')
    }, [cmd, command])
}

export function receiveOneBLiveMessage(content: PageFrame, cmd: string = ''): Promise<any> {
    logger.debug('waiting for blive fake message: ', cmd, content.url())
    return content.evaluate(([cmd]) => {
        return new Promise((res, rej) => {
            window.addEventListener('message', (e) => {
                if (e.source !== window) return
                if (e.data.source === 'bilibili-vup-stream-enhancer' && e.data.data.command === 'blive-ws') {
                    const content = e.data.data.body
                    if (cmd && content.cmd !== cmd) return
                    res(content)
                }
            })
            setTimeout(() => rej(new Error('timeout')), 60000)
        })
    }, [cmd])
}