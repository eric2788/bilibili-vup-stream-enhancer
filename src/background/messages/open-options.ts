import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.Handler = async (req, res) => {
    await new Promise<void>((res, ) => chrome.runtime.openOptionsPage(res))
}

export default handler