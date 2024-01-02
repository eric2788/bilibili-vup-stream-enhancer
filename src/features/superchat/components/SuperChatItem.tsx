import type { Superchat } from "~database/tables/superchat"


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
}



function SuperChatItem(props: SuperChatItemProps): JSX.Element {

    const {
        backgroundColor,
        backgroundImage,
        backgroundHeaderColor,
        userIcon,
        nameColor,
        uid,
        uname,
        price,
        message
    } = props;

    return (
        <div className="min-h-[70px] mb-[10px] border-solid border-[1px] w-full" style={{
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
            <div className="p-[10px] break-words text-[14px] relative">
                {message}
                <div
                    className="bg-cover w-[16px] h-[16px] absolute bottom-0 right-0"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                />
            </div>
        </div>
    )
}

export default SuperChatItem