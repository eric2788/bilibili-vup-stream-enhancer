import { getTSFiles } from '~utils/file'
const { contextMenus } = chrome

type OnMenuClick =  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => Promise<void> 

interface ContextMenuListener { 
    [index: string]: OnMenuClick
}

const rClickMenus = getTSFiles(__dirname, { ignore: '**/index.ts' })

const rClickMap: ContextMenuListener = {}

rClickMenus.forEach(async (file) => {
    const component = await import(file)
    contextMenus.create(component.properties)
})

contextMenus.onClicked.addListener(async (info, tab) => {
    const consume = rClickMap[info.menuItemId]
    if (!consume) return
    consume(info, tab).catch((error: Error | any) => {
        console.error('右鍵事件時出現錯誤: ', error.message ?? error)
        console.error(error)
    })
})