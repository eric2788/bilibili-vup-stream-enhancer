import type { StreamInfo } from "~api/bilibili"
import type { Settings } from "~settings"
import SuperChatItem, { type SuperChatCard } from "./SuperChatItem"
import { useContext } from "react"
import SuperChatContext from "~contexts/SuperChatContext"
import db from "~database"
import { toast } from "sonner/dist"
import { download } from "~utils/file"


export type SuperChatAreaProps = {
    settings: Settings
    info: StreamInfo
}

function SuperChatArea(props: SuperChatAreaProps): JSX.Element {

    const { superchats, clearSuperChat } = useContext(SuperChatContext)
    const { settings, info } = props

    const { enabledRecording } = settings['settings.features']

    const downloadRecords = () => {
        if (superchats.length === 0) {
            toast.warning(`下载失败`, {
                description: '醒目留言记录为空。',
                position: 'bottom-center'
            })
            return
        }
        const content = superchats.map(superchat => `[${superchat.date}] [￥${superchat.price}] ${superchat.uname}(${superchat.uid}): ${superchat.message}`).join('\n')
        download(`superchats-${info.room}-${new Date().toISOString().substring(0, 10)}.log`, content)
        toast.success(`下载成功`, {
            description: '你的醒目留言记录已保存。',
            position: 'bottom-center'
        })
    }

    const deleteRecords = () => {
        const deleting = async () => {
            let count = superchats.length
            if (enabledRecording.includes('superchat')) {
                count = await db.superchats
                    .where({ room: info.room })
                    .delete()
            }
            clearSuperChat()
            return count
        }
        toast.promise(deleting, {
            loading: `正在删除房间 ${info.room} 的所有醒目留言记录...`,
            error: (err) => `删除醒目留言记录失败: ${err}`,
            success: (count) => `已删除房间 ${info.room} 共${count}条醒目留言记录`,
            position: 'bottom-center'
        })
    }

    return (
        <div className="py-[5px] inline-block">
            <section className="px-[5px] flex justify-center items-center gap-2">
                <button onClick={downloadRecords} className="bg-red-600 hover:bg-red-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm">
                    导出醒目留言记录
                </button>
                <button onClick={deleteRecords} className="bg-red-600 hover:bg-red-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-sm">
                    刪除所有醒目留言记录
                </button>
            </section>
            <hr className="mx-[5px] my-3 border-black" />
            <section className="bjf-scrollbar flex flex-col gap-3 overflow-y-auto py-[5px] overflow-x-hidden w-[300px] h-[300px]">
                {superchats.map((item) => (
                    <SuperChatItem key={item.hash} {...item} />
                ))}
            </section>
        </div>
    )


}



export default SuperChatArea