import type { PlasmoMessaging } from "@plasmohq/messaging";

import icon from 'raw:~assets/icons/icon.png'

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { title, message } = req.body;
    return chrome.notifications.create({
        type: 'basic',
        title,
        message,
        iconUrl: icon
    })
}

export default handler;
