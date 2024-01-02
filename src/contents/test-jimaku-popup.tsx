import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { sendMessager } from "~utils/messaging"


import cssText from 'data-text:~style.css'
import { useForwarder } from "~hooks/forwarder"
import { Fragment } from "react"

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

  console.info('this is background script: ', chrome.tabs)

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

  const openJimakuPopup  = () => {
    sendMessager('open-window', { tab: 'jimaku' })
  }

  return (
    <Fragment>
      <button onClick={sendMessage} title="1"
      className="fixed z-90 bottom-10 right-8 bg-blue-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">&#9993;</button>
      <button onClick={openJimakuPopup} title="2"
      className="fixed z-90 top-10 right-8 bg-red-600 w-20 h-20 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-red-700 hover:drop-shadow-2xl hover:animate-bounce duration-300">&#9993;</button>
    </Fragment>
  )
}

export default TestApp