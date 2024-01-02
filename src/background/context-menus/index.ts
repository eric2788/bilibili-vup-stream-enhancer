import * as blacklist from './add-black-list';

const { contextMenus } = chrome

const menus = [
    blacklist
]

const rClickMap: {
    [index: string]: (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => Promise<void>
} = {}

for (const menu of menus) {
    const { properties, default: consume } = menu
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



