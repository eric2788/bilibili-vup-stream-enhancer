import type { Jimaku } from "./JimakuLine";
import JimakuButton from './JimakuButton';
import type { Settings } from "~settings";
import type { StreamInfo } from "~api/bilibili";
import db from '~database';
import { download } from '~utils/file';
import { sendMessager } from '~utils/messaging';
import { toast } from 'sonner/dist';
import { useRecords } from "~hooks/records";

export type ButtonAreaProps = {
    settings: Settings,
    info: StreamInfo
    clearJimaku: VoidFunction
    jimakus: Jimaku[]
}

function ButtonArea({ settings, info, clearJimaku, jimakus }: ButtonAreaProps): JSX.Element {

    const { order } = settings['settings.jimaku']
    const btnStyle = settings['settings.button']
    const features = settings["settings.features"]

    const popupJimakuWindow = () => sendMessager('open-window', { width: 500, url: chrome.runtime.getURL(`tabs/jimaku.html?roomId=${info.room}&title=${info.title}`) })

    const { deleteRecords, downloadRecords } = useRecords(info.room, jimakus, {
        feature: 'jimaku',
        table: features.enabledRecording.includes('jimaku') ? 'jimakus' : undefined,
        description: '字幕',
        format: (jimaku) => `[${jimaku.date}] ${jimaku.text}`,
        clearRecords: clearJimaku,
        reverse: order === 'top'
    })

    return (
        <div style={{ backgroundColor: btnStyle.backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
            <JimakuButton onClick={deleteRecords} btnStyle={btnStyle}>
                删除所有字幕记录
            </JimakuButton>
            {(features.enabledRecording.includes('jimaku') || info.status === 'online') &&
                <JimakuButton onClick={downloadRecords} btnStyle={btnStyle}>
                    下载字幕记录
                </JimakuButton>
            }
            {features.jimakuPopupWindow &&
                <JimakuButton onClick={popupJimakuWindow} btnStyle={btnStyle}>
                    弹出同传视窗
                </JimakuButton>
            }
        </div>
    )
}


export default ButtonArea