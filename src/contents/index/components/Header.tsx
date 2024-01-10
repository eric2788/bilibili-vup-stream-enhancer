import { Typography, IconButton } from "@material-tailwind/react"
import { useContext } from "react"
import StreamInfoContext from "~contexts/StreamInfoContexts"


function Header({ closeDrawer }: { closeDrawer: VoidFunction }): JSX.Element {

    const { info } = useContext(StreamInfoContext)

    return (
        <div className="mb-3 flex items-center justify-between text-ellipsis">
            <div className="flex justify-start items-start flex-col">
                <Typography variant="h5" className="dark:text-white">
                    {info.title}
                </Typography>
                <Typography variant="small" className="dark:text-white">
                    {info.username} 的直播间
                </Typography>
            </div>
            <IconButton variant="text" onClick={closeDrawer}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </IconButton>
        </div>
    )
}

export default Header