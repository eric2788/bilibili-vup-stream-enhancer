import type { PlasmoMessaging } from "@plasmohq/messaging";
import migrateFromMV2 from "~migrations";
import type { Settings } from "~options/fragments";

export type ResponseBody = { data?: Settings, error?: string }

const handler: PlasmoMessaging.MessageHandler<{}, ResponseBody> = async (req, res) => {
    try {
        const settings = await migrateFromMV2()
        res.send({ data: settings })
    } catch (err: any) {
        console.error('Error while migrating settings from mv2', err)
        res.send({ error: err.message ?? String(err) })
    }
}

export default handler