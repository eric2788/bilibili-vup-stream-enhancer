import { getTSFiles } from "~utils/file"

const browser = process.env.PLASMO_BROWSER || 'chrome'

const updaters = getTSFiles(__dirname, { ignore: '**/index.ts' })
const updaterMap = {}

updaters.forEach(async (file) => {
    try {
        const component = await import(file)
        updaterMap[component.name] = component.default
    } catch (error: any) {
        console.error(`更新器 ${file} 載入失敗: `, error.message ?? error)
        console.error(error)
    }
})

