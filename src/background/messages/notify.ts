import type { PlasmoMessaging } from "@plasmohq/messaging"

import icon from 'raw:assets/icon.png'

export type RequestBody = Partial<Omit<chrome.notifications.NotificationOptions<true>, 'buttons'>> & {
    messages?: string[],
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

const handler: PlasmoMessaging.MessageHandler<RequestBody, string> = async (req, res) => {
    const { title, message, messages, type, buttons, onClicked, ...option } = req.body
    const id = await createNotification({
        type: type ?? 'basic',
        title,
        message: message ?? messages?.join('\n') ?? '',
        buttons: buttons?.map(({ clicked, ...option }) => option),
        ...option,
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
    res.send(id)
}

export default handler
