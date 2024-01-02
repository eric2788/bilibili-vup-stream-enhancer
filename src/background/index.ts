import { getForwarder, sendForward } from './forwards'
import { sendInternal } from './messages'

import './context-menus'

// browser extension icon click listener
chrome.action.onClicked.addListener(() => {
    sendInternal('open-tab', { tab: 'settings' })
})

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

getForwarder('redirect', 'background').addHandler(data => {
    console.info('received redirect: ', data)
    sendForward(data.target, data.command, data.body, data.queryInfo ?? { active: true })
})