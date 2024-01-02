import { getPort } from "@plasmohq/messaging/port"
import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

function App(): JSX.Element {
    console.info('hello world from index.tsx')
    return <></>
}

export default App


