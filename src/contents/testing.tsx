import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { injectScript } from "~utils/inject";
import { sendMessager } from "~utils/messaging";
import styleText from "data-text:~style.css"

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
        await sendMessager('inject-script', {
            script: injectScript('testOnly')
        })
    }

    return (
        <button onClick={click}
            className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">&#9993;</button>
    )
}


export default App