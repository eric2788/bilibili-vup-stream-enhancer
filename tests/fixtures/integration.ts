import { getJSFiles } from "@tests/utils/file"
import * as esbuild from "esbuild"
import { base } from "./base"
import logger from "@tests/helpers/logger"

export type IntegrationFixtures = {
    modules: Record<string, FileModule>
}

export type FileModule = {
    path: string
    code: string
}

export const test = base.extend<IntegrationFixtures>({

    modules: [
        async ({ }, use) => {
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
                        code: file.text
                    })
                ])
            )
            logger.info(`loaded ${Object.keys(modules).length} modules`)
            await use(modules)
        },
        { timeout: 0 }
    ],
})

export const expect = test.expect