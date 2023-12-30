import type { StreamInfo } from "~api/bilibili"
import { sendForward } from "~background/forwards"
import type { Settings } from "~settings"
import { sendMessager } from "~utils/messaging"
import JimakuButton from "./JimakuButton"


export type ButtonAreaProps = { 
    settings: Settings, 
    info: StreamInfo 
}

function ButtonArea({ settings, info }: ButtonAreaProps): JSX.Element {

    const btnStyle = settings['settings.button']
    const features = settings["settings.features"]

    console.info('backgroundListColor: ', btnStyle.backgroundListColor)

    const testClick = async () => {
        sendForward('background', 'redirect', { target: 'content-script', command: 'command', body: { command: 'stop' }, queryInfo: { url: location.href } })
    }

    const popupJimakuWindow = () => sendMessager('open-window', { url: chrome.runtime.getURL(`tabs/jimaku.html?roomId=${info.room}&title=${info.title}`) })

    return (
        <div style={{ backgroundColor: btnStyle.backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
            <JimakuButton btnStyle={btnStyle}>
                删除所有字幕记录
            </JimakuButton>
            {features.enabledRecording.includes('jimaku') &&
                <JimakuButton btnStyle={btnStyle}>
                    下载字幕记录
                </JimakuButton>
            }
            {features.jimakuPopupWindow &&
                <JimakuButton onClick={popupJimakuWindow} btnStyle={btnStyle}>
                    弹出同传视窗
                </JimakuButton>
            }
            <JimakuButton btnStyle={btnStyle} onClick={testClick}>
                測試按鈕
            </JimakuButton>
        </div>
    )
}


export default ButtonArea