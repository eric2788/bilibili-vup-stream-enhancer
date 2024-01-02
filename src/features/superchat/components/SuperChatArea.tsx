import { Fragment, useEffect, useState } from "react"
import type { StreamInfo } from "~api/bilibili"
import type { Settings } from "~settings"
import SuperChatItem, { type SuperChatItemProps } from "./SuperChatItem"
import type { Superchat } from "~database/tables/superchat"
import { useBLiveMessage, useBLiveMessageCommand } from "~hooks/message"
import { fetchSameCredentialBase, fetchSameCredentialV1 } from "~utils/fetch"
import type { SuperChatList } from "~types/bilibili"



export type SuperChatCard = SuperChatItemProps & { id: number }

export type SuperChatAreaProps = {
    superchats: SuperChatCard[]
    settings: Settings
    info: StreamInfo
}



function SuperChatArea(props: SuperChatAreaProps): JSX.Element {

    const { superchats, settings, info } = props

    return (
        <div className="p-[5px] inline-block">
            <section className="flex justify-center items-center gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
                    导出醒目留言记录
                </button>
            </section>
            <hr className="my-3 border-black" />
            <section className="flex flex-col gap-3 overflow-y-auto p-[5px] overflow-x-hidden w-[300px] h-[300px]">
                {superchats.map((item) => (
                    <SuperChatItem key={item.id} {...item} />
                ))}
            </section>
        </div>
    )


}



export default SuperChatArea