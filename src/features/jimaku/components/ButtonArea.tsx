import { Fragment, useContext, useState } from "react";
import JimakuFeatureContext from "~contexts/JimakuFeatureContext";
import ContentContext from "~contexts/ContentContexts";
import { useRecords } from "~hooks/records";
import { usePopupWindow } from "~hooks/window";
import JimakuButton from './JimakuButton';
import type { Jimaku } from "./JimakuLine";
import { createPortal } from "react-dom";
import ButtonSwitchList from "./ButtonSwitchList";
import TailwindScope from "~components/TailwindScope";
import { toast } from "sonner/dist";
import { sendMessager } from "~utils/messaging";
import { sendForward } from "~background/forwards";
import { sleep } from "~utils/misc";

export type ButtonAreaProps = {
    clearJimaku: VoidFunction
    jimakus: Jimaku[]
}

function ButtonArea({ clearJimaku, jimakus }: ButtonAreaProps): JSX.Element {

    const { settings, info } = useContext(ContentContext)
    const { jimakuZone, buttonZone: btnStyle, jimakuPopupWindow, aiZone } = useContext(JimakuFeatureContext)

    const { order } = jimakuZone
    const { enabledRecording } = settings["settings.features"]
    const { elements: { upperHeaderArea } } = settings['settings.developer']

    const { createPopupWindow } = usePopupWindow(true, { width: 500 })

    const { deleteRecords, downloadRecords } = useRecords(info.room, jimakus, {
        feature: 'jimaku',
        table: enabledRecording.includes('jimaku') ? 'jimakus' : undefined,
        description: '字幕',
        format: (jimaku) => `[${jimaku.date}] ${jimaku.text}`,
        clearRecords: clearJimaku,
        reverse: order === 'top'
    })

    const [show, setShow] = useState(!info.isTheme)

    const summerize = async () => {
        if (jimakus.length < 10) {
            toast.warning('至少需要有10条同传字幕才可总结。')
            return
        }
        await sendMessager('open-tab', { tab: 'summarizer', params: { roomId: info.room, title: info.title }, active: true, singleton: true })
        await sleep(2000)
        sendForward('pages', 'jimaku-summarize', { roomId: info.room, jimakus: jimakus.map(j => j.text) })
    }

    return (
        <Fragment>
            {show && (
                <div data-testid="subtitle-button-list" style={{ backgroundColor: btnStyle.backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
                    <JimakuButton onClick={deleteRecords}>
                        删除所有字幕记录
                    </JimakuButton>
                    {(enabledRecording.includes('jimaku') || info.status === 'online') &&
                        <JimakuButton onClick={downloadRecords}>
                            下载字幕记录
                        </JimakuButton>
                    }
                    {info.status === 'online' && jimakuPopupWindow &&
                        <JimakuButton
                            onClick={createPopupWindow(`jimaku.html`, {
                                roomId: info.room,
                                title: info.title,
                                owner: info.username
                            })}
                        >
                            弹出同传视窗
                        </JimakuButton>
                    }
                    {aiZone.enabled && (
                        <JimakuButton onClick={summerize}>
                            同传字幕AI总结
                        </JimakuButton>
                    )}
                </div>
            )}
            {info.isTheme && document.querySelector(upperHeaderArea) !== null && createPortal(
                <TailwindScope>
                    <ButtonSwitchList switched={show} onClick={() => setShow(!show)} />
                </TailwindScope>,
                document.querySelector(upperHeaderArea)
            )}
        </Fragment>
    )
}


export default ButtonArea