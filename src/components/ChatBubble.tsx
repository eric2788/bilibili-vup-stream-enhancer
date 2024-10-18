import { Avatar } from "@material-tailwind/react"
import type { ReactNode } from "react"



export type ChatBubbleProps = {
    avatar: string
    name: string
    messages: Chat[]
    loading?: boolean
    footer?: ReactNode
}

export type Chat = {
    text: ReactNode
    time?: string
}


function ChatBubble(props: ChatBubbleProps): JSX.Element {
    const { avatar, name, messages, loading, footer } = props
    return (
        <div className="flex gap-2.5 mb-4">
            <Avatar src={avatar} />
            <div className="grid">
                <h5 data-testid={`${name}-bubble-username`} className="text-gray-900 text-sm font-semibold leading-snug pb-1">{name}</h5>
                {messages.map((message, index) => (
                    <div key={index} className="max-w-full grid">
                        <div data-testid={`${name}-bubble-chat-${index}`} className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
                            <h5 className={`text-gray-900 text-sm font-normal leading-snug ${loading ? 'animate-pulse' : ''}`}>{message.text}</h5>
                        </div>
                        {message.time && (
                            <div data-testid={`${name}-bubble-time-${index}`} className="justify-end items-center inline-flex mb-2.5">
                                <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">{message.time}</h6>
                            </div>
                        )}
                    </div>
                ))}
                {footer}
            </div>
        </div>
    )
}

export default ChatBubble