import logger from "@tests/helpers/logger";
import type { PageFrame } from "@tests/helpers/page-frame";

/**
 * Sends a fake BLive message to the specified page frame.
 * @param content The page frame to send the message to.
 * @param cmd The command to send.
 * @param command The command object to send.
 * @returns A promise that resolves when the message is sent.
 */
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

/**
 * Receives a single blive message from a page frame.
 * @param content - The page frame to receive the message from.
 * @param cmd - The command to filter the message by (optional).
 * @returns A promise that resolves with the received message.
 */
export function receiveOneBLiveMessage(content: PageFrame, cmd: string = ''): Promise<any> {
    logger.debug('waiting for blive fake message: ', cmd, content.url())
    return content.evaluate(([cmd]) => {
        return new Promise((res, rej) => {
            const handler = (e: MessageEvent) => {
                if (e.source !== window) return
                if (e.data.source === 'bilibili-vup-stream-enhancer' && e.data.data.command === 'blive-ws') {
                    const content = e.data.data.body
                    if (cmd && content.cmd !== cmd) return
                    window.removeEventListener('message', handler)
                    res(content)
                }
            }
            window.addEventListener('message', handler)
            setTimeout(() => rej(new Error('timeout')), 60000)
        })
    }, [cmd])
}