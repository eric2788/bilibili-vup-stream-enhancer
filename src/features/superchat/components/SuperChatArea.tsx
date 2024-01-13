import { useContext, useRef } from "react"
import StreamInfoContext from "~contexts/StreamInfoContexts"
import { useScrollOptimizer } from "~hooks/optimizer"
import { useRecords } from "~hooks/records"
import SuperChatItem, { type SuperChatCard } from "./SuperChatItem"
import SuperChatFeatureContext from "~contexts/SuperChatFeatureContext"


export type SuperChatAreaProps = {
    superchats: SuperChatCard[],
    clearSuperChat: VoidFunction
}

function SuperChatArea(props: SuperChatAreaProps): JSX.Element {

    const { settings, info } = useContext(StreamInfoContext)
    const { buttonColor } = useContext(SuperChatFeatureContext)
    const { superchats, clearSuperChat } = props
    const { enabledRecording } = settings['settings.features']

    const listRef = useRef<HTMLElement>(null)

    const observer = useScrollOptimizer({ root: listRef, rootMargin: '100px', threshold: 0.13 })

    const { downloadRecords, deleteRecords } = useRecords(info.room, superchats, {
        feature: 'superchat',
        table: enabledRecording.includes('superchat') ? 'superchats' : undefined,
        description: '醒目留言',
        format: (superchat) => `[${superchat.date}] [￥${superchat.price}] ${superchat.uname}(${superchat.uid}): ${superchat.message}`,
        clearRecords: clearSuperChat,
        reverse: true // superchat always revsered
    })

    return (
        <div className="p-[5px] pt-[5px] rounded-md inline-block">
            <section className="px-[5px] flex justify-center items-center gap-2">
                <button style={{backgroundColor: buttonColor}} onClick={downloadRecords} className="hover:brightness-90 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm">
                    导出醒目留言记录
                </button>
                <button style={{backgroundColor: buttonColor}} onClick={deleteRecords} className="hover:brightness-90 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm">
                    刪除所有醒目留言记录
                </button>
            </section>
            <hr className="mx-[5px] my-3 border-black" />
            <section ref={listRef} className="bjf-scrollbar flex flex-col gap-3 overflow-y-auto py-[5px] overflow-x-hidden w-[300px] h-[300px]">
                {superchats.map((item) => (
                    <div key={item.hash} className="px-2" superchat-hash={item.hash}>
                        <SuperChatItem {...item} observer={observer} />
                    </div>
                ))}
            </section>
        </div>
    )


}



export default SuperChatArea