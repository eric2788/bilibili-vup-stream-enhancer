const { contextMenus } = chrome

contextMenus.create({
    id: 'add-black-list',
    title: '添加到黑名单',
    documentUrlPatterns: ['https://live.bilibili.com/*'],
    contexts: ['page'],
    enabled: true
})

contextMenus.onClicked.addListener((info, tab) => {
})
