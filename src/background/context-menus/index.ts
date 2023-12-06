import { getModuleStream } from '~utils/file'
const { contextMenus } = chrome

type OnMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => Promise<void>

interface ContextMenuListener {
    [index: string]: OnMenuClick
}


export default async function () {

    const menus = getModuleStream(__dirname)
    const rClickMap: ContextMenuListener = {}

    for await (const { file, module: menu } of menus) {
        const { properties, default: consume } = menu
        if (!properties || !consume) {
            console.warn(`右鍵菜單 ${file} 載入失敗: `, '缺少必要的屬性或消費函數')
            continue
        }
        rClickMap[properties.id] = consume
        contextMenus.create(properties)
    }

    contextMenus.onClicked.addListener((info, tab) => {
        const consume = rClickMap[info.menuItemId]
        if (!consume) return
        consume(info, tab).catch((error: Error) => {
            console.error('右鍵事件時出現錯誤: ', error.message ?? error)
            console.error(error)
        })
    })

}
