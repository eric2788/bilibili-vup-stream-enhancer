import type { MutableRefObject } from "react"
import { useRowOptimizer } from "~hooks/optimizer"

export type SuperChatCard = SuperChatItemProps & { id: number, date: string, hash: string }

export type SuperChatItemProps = {
    backgroundColor: string
    backgroundImage: string,
    backgroundHeaderColor: string,
    userIcon: string,
    nameColor: string,
    uid: number
    uname: string
    price: number
    message: string
    timestamp: number
    persist: boolean
}

function SuperChatItem(props: SuperChatItemProps & { observer: MutableRefObject<IntersectionObserver> }): JSX.Element {

    const {
        backgroundColor,
        backgroundImage,
        backgroundHeaderColor,
        userIcon,
        nameColor,
        uid,
        uname,
        price,
        message,
        timestamp,
        persist,

        observer

    } = props;


    const ref = useRowOptimizer(observer)

    return (
        <div ref={ref} title={new Date(timestamp * 1000).toLocaleString()} className="mb-[10px] border-solid border-[1px] w-full" style={{
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            animation: 'top .5s ease-out',
            boxShadow: '1px 1px 5px black'
        }}>
            <div className="p-[5px] bg-contain bg-no-repeat relative" style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: backgroundHeaderColor,
                backgroundPosition: 'right center', // tailwind not support!
            }}>
                <a
                    href={`//space.bilibili.com/${uid}`}
                    target="_blank">
                    <img
                        src={userIcon}
                        height={40}
                        width={40}
                        className="rounded-[20px] float-left"
                    />
                </a>
                <a
                    href={`//space.bilibili.com/${uid}`}
                    target="_blank"
                    className="text-[15px] leading-[40px] pl-[5px]"
                    style={{
                        color: nameColor,
                        textDecoration: 'none'
                    }}>{uname}</a>
                <span className="text-[15px] float-right text-black">￥{price}</span>
                {!persist && (
                    <div className="right-1 bottom-1 absolute" title="此醒目留言为暂存数据，不会被持久化。">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 stroke-[#646c7a]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-[10px] break-words text-[14px] text-white">
                {message}
            </div>
        </div>
    )
}

export default SuperChatItem