import { getJSFiles } from "@tests/utils/file"
import * as esbuild from "esbuild"
import { base } from "./base"
import logger from "@tests/helpers/logger"
import type { StreamUrls } from "~background/messages/get-stream-urls"
import { Strategy } from "@tests/utils/misc"
import type { LiveRoomInfo } from "@tests/helpers/bilibili-api"
import fs from 'fs/promises'

export type IntegrationFixtures = {
    modules: Record<string, FileModule>
    room: LiveRoomInfo & { stream: StreamUrls }
    clearOutDir(): Promise<void>
}

export type FileModule = {
    path: string
    code: string
    loadToPage(): Promise<void>
}

export const test = base.extend<IntegrationFixtures>({

    modules: [
        async ({ page }, use) => {
            const results = await esbuild.build({
                bundle: true,
                outdir: 'out/modules',
                entryPoints: getJSFiles('tests/modules'),
                write: false,
            })
            const modules = Object.fromEntries(
                results.outputFiles.map(file => [
                    file.path.split(/[\\\/]/).pop().split('.')[0],
                    ({
                        path: file.path,
                        code: file.text,
                        loadToPage: async () => {
                            await page.addScriptTag({ content: file.text, type: 'module' })
                        }
                    })
                ])
            )
            logger.info(`loaded ${Object.keys(modules).length} modules`)
            await use(modules)
        },
        { timeout: 0 }
    ],

    page: async ({ page }, use) => {
        await page.goto('https://www.google.com/')
        await use(page)
        await page.close()
    },

    room: async ({ api, rooms }, use) => {
        logger.debug(`selecting from ${rooms.length} rooms`)
        const iterator = Strategy.random(rooms)
        let stream: StreamUrls
        let selected: LiveRoomInfo
        for (const room of iterator) {
            try {
                logger.info(`尝试获取房间 ${room.roomid} 的流`)
                stream = await api.getStreamUrls(room.roomid)
                if (stream.length === 0) continue
                selected = room
                break
            } catch (err: any) {
                logger.warn(`获取房间 ${room.roomid} 的流失败: ${err?.message}`)
                logger.info(`尝试下一个房间`)
            }
        }
        test.skip(!selected || !stream || stream.length === 0, '无法获取直播流')
        await use({ stream, ...selected })
    }
})

export const expect = test.expect


test.beforeEach(async ({ context }) => {
    await fs.rm('out', { recursive: true, force: true })
    await fs.mkdir('out', { recursive: true })
    context.on('console', logger.debug)
})

test.afterEach(async ({ page, context }) => {
    await page.close()
    await context.close()
})