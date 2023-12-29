import styleText from "data-text:~style.css";
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { toast } from "sonner/dist";
import { injectScript } from "~utils/inject";
import { sendMessager } from "~utils/messaging";
import iconImg from 'url:~assets/icon.png'

import "~toaster";
import TailwindScope from "~components/TailwindScope";

export const config: PlasmoCSConfig = {
    matches: ["*://static.ericlamm.xyz/"],
}

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style")
    style.textContent = styleText
    return style
}

function App(): JSX.Element {

    const click = async () => {
        console.info('running inject script...')
        const running = sendMessager('inject-script', {
            script: injectScript('testOnly')
        })
        toast.promise(running, {
            loading: (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div>Loading....</div>
                    <div><img src={iconImg} alt="icon" height={26} width={26} /></div>
                </div>
            ),
            success: 'Running Successfully.',
            error: 'Error',
            position: 'top-center'
        })
        await running
        console.info('inject script done.')
    }

    return (
        <button onClick={click}
            className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">&#9993;</button>
    )
}

export default App