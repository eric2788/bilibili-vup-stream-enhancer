import type { Jimaku } from "./JimakuLine";
import JimakuButton from './JimakuButton';
import type { Settings } from "~settings";
import type { StreamInfo } from "~api/bilibili";
import db from '~database';
import { download } from '~utils/file';
import { sendMessager } from '~utils/messaging';
import { toast } from 'sonner/dist';

export type ButtonAreaProps = {
    settings: Settings,
    info: StreamInfo
    clearJimaku: VoidFunction
    jimakus: Jimaku[]
}

function ButtonArea({ settings, info, clearJimaku, jimakus }: ButtonAreaProps): JSX.Element {

    const btnStyle = settings['settings.button']
    const features = settings["settings.features"]

    const popupJimakuWindow = () => sendMessager('open-window', { url: chrome.runtime.getURL(`tabs/jimaku.html?roomId=${info.room}&title=${info.title}`) })

    const deleteRecords = () => {
        const deleting = async () => {
            let count = jimakus.length
            if (features.enabledRecording.includes('jimaku')) {
                count = await db.jimakus
                    .where({ room: info.room })
                    .delete()
            }
            clearJimaku()
            return count
        }
        toast.promise(deleting, {
            loading: `正在删除房间 ${info.room} 的所有字幕记录...`,
            error: (err) => `删除字幕记录失败: ${err}`,
            success: (count) => `已删除房间 ${info.room} 共${count}条字幕记录`,
            position: 'bottom-center'
        })
    }

    const downloadRecords = () => {
        if (jimakus.length === 0) {
            toast.warning(`下载失败`, {
                description: '字幕记录为空。',
                position: 'bottom-center'
            })
            return
        }
        const content = jimakus.map(jimaku => `[${jimaku.date}] ${jimaku.text}`).join('\n')
        download(`subtitles-${info.room}-${new Date().toISOString().substring(0, 10)}.log`, content)
        toast.success(`下载成功`, {
            description: '你的字幕记录已保存。',
            position: 'bottom-center'
        })
    }


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