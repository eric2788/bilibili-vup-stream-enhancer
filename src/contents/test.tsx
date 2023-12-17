import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { usePort } from "@plasmohq/messaging/hook"
import { sendBackground, sendPort } from "~utils/messaging"


import cssText from 'data-text:~style.css'
import { useEffect } from "react"
import { useForwarder } from "~hooks/forwarder"

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


  const jimaku = useForwarder('jimaku', 'content-script')

  const sendMessage = () => {
    const message = prompt('input your message', 'hello world')
    jimaku.sendForward('pages',
      {
        text: message,
        date: new Date().toLocaleTimeString(),
        room: '12345678'
      }
    )
    console.info('send message success')
  }

  return (
    <button onClick={sendMessage} title="Contact Sale"
      className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">&#9993;</button>
  )
}

export default TestApp