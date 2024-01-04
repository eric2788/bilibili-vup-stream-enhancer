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
}

function SuperChatItem(props: SuperChatItemProps & { observer: MutableRefObject<IntersectionObserver>}): JSX.Element {

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

        observer
        
    } = props;


    const ref = useRowOptimizer(observer)

    return (
        <div ref={ref} title={new Date(timestamp * 1000).toLocaleString()} className="mb-[10px] border-solid border-[1px] w-full" style={{
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            animation: 'slide-y .5s ease-out',
            boxShadow: '1px 1px 5px black'
        }}>
            <div className="p-[5px] bg-contain bg-no-repeat" style={{
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
            </div>
            <div className="p-[10px] break-words text-[14px] text-white">
                {message}
            </div>
        </div>
    )
}

export default SuperChatItem