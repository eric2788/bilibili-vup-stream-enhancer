import RecorderFeatureContext from "~contexts/RecorderFeatureContext";
import type { FeatureHookRender } from "~features";
import { sendMessager } from "~utils/messaging";
import RecorderLayer from "./components/RecorderLayer";

export const FeatureContext = RecorderFeatureContext

const handler: FeatureHookRender = async (settings, info) => {

    const { error, data: urls } = await sendMessager('get-stream-urls', { roomId: info.room })
    if (error) {
        console.warn('啟用快速切片功能失敗: ', error)
        return '啟用快速切片功能失敗: '+ error // 返回 string 以顯示錯誤
    }

    return [
        <RecorderLayer key={info.room} urls={urls} />
    ]
}




export default handler