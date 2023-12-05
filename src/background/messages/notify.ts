import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { title, message } = req.body;
    return chrome.notifications.create({
        type: 'basic',
        title,
        message,
        iconUrl: chrome.runtime.getURL('icons/icon.png')
    })
}

export default handler;
