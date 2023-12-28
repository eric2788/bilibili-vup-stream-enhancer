import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo";
import { useState } from "react";
import styleText from 'data-text:~style.css'
import testJs from 'url:~test.js'
import { sendMessager } from "~utils/messaging";


export const config: PlasmoCSConfig = {
  matches: ["https://static.ericlamm.xyz/"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

function App(): JSX.Element {

  const [hooked, setHooked] = useState(false)

  const toggle = async () => {
    if (hooked) {
      await sendMessager('inject-script', {
        fileUrl: testJs,
        func: 'unhook',
      })
      console.info('unhooked!')
    } else {
      await sendMessager('inject-script', {
        fileUrl: testJs,
        func: 'hook',
      })
      console.info('hooked!')
    }
    setHooked(!hooked)
  }

  return (
    <button
      onClick={toggle}
      title="Test"
      className={`fixed z-90 bottom-10 right-8 ${hooked ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:drop-shadow-2xl hover:animate-bounce duration-300`}>&#9993;</button>
  )
}

export default App