import type { PlasmoMessaging } from "@plasmohq/messaging"

import icon from 'raw:~assets/icon.png'

export type RequestBody = {
    title: string,
    message: string
    buttons?: (chrome.notifications.ButtonOptions & { clicked: (id: string, index: number) => void })[],
    onClicked?: (id: string) => void
}

async function createNotification(option: chrome.notifications.NotificationOptions<true>): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.notifications.create(option, id => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(id)
            }
        })
    })
}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {
    const { title, message, buttons, onClicked } = req.body
    const id = await createNotification({
        type: 'basic',
        title,
        message,
        iconUrl: icon
    })

    const callbackFunc = (notificationId: string) => {
        if (id !== notificationId) return
        onClicked(notificationId)
        chrome.notifications.onClicked.removeListener(callbackFunc)
    }

    const buttonCallbackFunc = (notificationId: string, index: number) => {
        if (id !== notificationId) return
        const button = buttons[index]
        if (button?.clicked) button.clicked(id, index)
        chrome.notifications.onButtonClicked.removeListener(buttonCallbackFunc)
    }

    if (buttons?.length > 0) chrome.notifications.onButtonClicked.addListener(buttonCallbackFunc)
    if (onClicked) chrome.notifications.onClicked.addListener(callbackFunc)
}

export default handler
