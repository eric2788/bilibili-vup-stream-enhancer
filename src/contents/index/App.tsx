import { Drawer } from "@material-tailwind/react";

import { useToggle } from "@react-hooks-library/core";
import { Fragment, useContext } from "react";
import StreamInfoContext from "~contexts/StreamInfoContexts";
import { useWebScreenChange } from "~hooks/bilibili";
import ButtonList from "./components/ButtonList";
import FloatingMenuButton from "./components/FloatingMenuButtion";
import Footer from "./components/Footer";
import Header from "./components/Header";


function App(): JSX.Element {

  const streamInfo = useContext(StreamInfoContext)

  // i don't know why the hell this got rendered at the top level during HMR, should be the bug for plasmo
  if (!streamInfo) {
    console.warn('plasmo framework bug: streamInfo is undefined')
    return <></>
  }

  const { info, settings } = streamInfo

  const { "settings.display": displaySettings } = settings

  // 狀態為離綫時，此處不需要顯示按鈕
  // 離綫下載按鈕交給 feature UI 處理
  if (info.status === 'offline') {
    return <></>
  }

  const screenStatus = useWebScreenChange(settings['settings.developer'].classes)
  const { bool: open, setFalse: closeDrawer, toggle } = useToggle(false)

  if (screenStatus !== 'normal' && !displaySettings.supportWebFullScreen) {
    return <></>
  }

  return (
    <Fragment>
      <FloatingMenuButton toggle={toggle} />
      <Drawer placement={screenStatus === 'normal' ? 'right' : 'left'} open={open} onClose={closeDrawer} className={`p-4 bg-gray-300 dark:bg-gray-800 shadow-md`}>
        <main className="flex flex-col justify-between h-full">
          <section>
            <Header closeDrawer={closeDrawer} />
            <ButtonList />
          </section>
          <Footer />
        </main>
      </Drawer>
    </Fragment>
  )
}


export default App