import RecorderFeatureContext from "~contexts/RecorderFeatureContext";
import type { FeatureHookRender } from "~features";
import { sendMessager } from "~utils/messaging";
import RecorderLayer from "./components/RecorderLayer";
import { toast } from "sonner";

export const FeatureContext = RecorderFeatureContext

const handler: FeatureHookRender = async (settings, info) => {

    const { error, data: urls } = await sendMessager('get-stream-urls', { roomId: info.room })
    if (error) {
        toast.error('启用快速切片功能失败: '+ error)
        return undefined // disable the feature
    }

    return [
        <RecorderLayer key={info.room} urls={urls} />
    ]
}




export default handler