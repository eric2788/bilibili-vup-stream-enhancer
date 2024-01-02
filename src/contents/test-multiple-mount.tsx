import { getPort } from "@plasmohq/messaging/port"
import type { PlasmoCSConfig, PlasmoCSUIAnchor, PlasmoGetInlineAnchor, PlasmoGetOverlayAnchor, PlasmoRender } from "plasmo"
import { Fragment, createElement } from "react"
import { createPortal, render as renderReact } from "react-dom"
import { createRoot } from "react-dom/client"

export const config: PlasmoCSConfig = {
  matches: ["https://koishi.ericlamm.xyz/"],
  all_frames: true
}

//export const getInlineAnchor: PlasmoGetInlineAnchor = async () => document.querySelector("div.choices")

// This function overrides the default `createRootContainer`
export const getRootContainer: () => Promise<Element> = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainer = document.querySelector('div.choices')
      if (rootContainer) {
        clearInterval(checkInterval)
        resolve(rootContainer)
      }
    }, 137)
  })


export const render: PlasmoRender<any> = async (
  {
    anchor, // the observed anchor, OR document.body.
    createRootContainer // This creates the default root container
  },
  InlineCSUIContainer,
  OverlayCSUIContainer
) => {


  const div = document.createElement('div')
  div.id = 'plasmo'
  document.body.appendChild(div)

  const rootContainer = await createRootContainer()

  const Portal = () => createPortal(<App anchor={anchor} />, rootContainer)

  const root = createRoot(div)

  root.render(<Portal />)
}

console.info('hello world!!')


function App({ anchor }: { anchor: PlasmoCSUIAnchor }): JSX.Element {
  return (
    <Fragment>
      <div className="choice">
        <h2>FUCK YOU</h2>
        <p>anchor: {anchor.type}</p>
      </div>
      <div className="choice">
        <h2>FUCK ME</h2>
        <p>anchor: {anchor.type}</p>
      </div>
      <div className="choice">
        <h2>FUCK US</h2>
        <p>anchor: {anchor.type}</p>
      </div>
    </Fragment>
  )
}

export default App
