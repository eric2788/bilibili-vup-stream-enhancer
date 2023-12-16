import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { getPort } from "@plasmohq/messaging/port"
import { sendPort } from "~utils/messaging"


import cssText from 'data-text:~style.css'

export const config: PlasmoCSConfig = {
  matches: ["https://static.ericlamm.xyz/*"],
  all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}


function TestApp(): JSX.Element {

  const sendMessage = () => {
    const message = prompt('input your message', 'hello world')
    sendPort('jimaku', message)
  }

  return (
    <button onClick={sendMessage} title="Contact Sale"
      className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">&#9993;</button>
  )
}

getPort('jimaku').onMessage.addListener((message) => {
  console.log('received from test.tsx', message)
})

export default TestApp