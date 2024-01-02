
import './context-menus'
import { sendInternal } from './messages'

// browser extension icon click listener
chrome.action.onClicked.addListener(() => {
    sendInternal('open-tab', { tab: 'settings' })
})

