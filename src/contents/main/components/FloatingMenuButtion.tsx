import extIcon from 'raw:~assets/icon.png';


function FloatingMenuButton({ toggle }: { toggle: VoidFunction }) {
    return (
        <div onClick={toggle} className="cursor-pointer group fixed flex justify-end top-72 left-0 rounded-r-2xl shadow-md p-3 bg-white dark:bg-gray-800 transition-transform transform -ml-6 w-28 hover:translate-x-5 overflow-hidden">
            <button className="flex flex-col justify-center items-center text-center gap-3">
                <img src={extIcon} alt="bjf" height={26} width={26} className="group-hover:animate-pulse" />
                <span className="text-md text-gray-800 dark:text-white">功能菜单</span>
            </button>
        </div>
    )
}


export default FloatingMenuButton