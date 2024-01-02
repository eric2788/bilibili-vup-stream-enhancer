
import { sendBackground } from '~utils/messaging'
import loadContextMenus from './context-menus'



Promise.all([
    loadContextMenus()
]).catch((error: Error) => {
    console.error('initialize error: ', error.message ?? error)
    console.error(error)
})



// browser extension icon click listener
chrome.browserAction.onClicked.addListener(() => sendBackground('open-tab', { tab: 'settings' }))