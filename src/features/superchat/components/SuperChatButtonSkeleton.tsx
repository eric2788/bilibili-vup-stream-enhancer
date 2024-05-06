import { Spinner } from "@material-tailwind/react"

function SuperChatButtonSkeleton(): JSX.Element {
    return (
        <div
            style={{
                left: window.innerWidth - 500,
                top: 96,
                width: 85,
                height: 85
            }}
            className="absolute rounded-full bg-white p-3 drop-shadow-lg flex flex-col justify-center items-center gap-3 text-black">
            <Spinner />
            <div>醒目留言</div>
        </div>
    )
}

export default SuperChatButtonSkeleton