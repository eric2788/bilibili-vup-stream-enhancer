import type { PlasmoMessaging } from "@plasmohq/messaging";


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { url, tab } = req.body;
    chrome.tabs.create({ url: tab ? `../tabs/${tab}.html` : url });
};


export default handler;