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

  const { info, settings } = useContext(StreamInfoContext)

  const { "settings.display": displaySettings } = settings

  // 狀態為離綫時，此處不需要顯示按鈕
  // 離綫下載按鈕交給 feature UI 處理
  if (info.status === 'offline') {
    return <></>
  }

  const screenStatus = useWebScreenChange(settings['settings.developer'].classes)

  if (screenStatus !== 'normal' && !displaySettings.supportWebFullScreen) {
    return <></>
  }

  const { bool: open, setFalse: closeDrawer, toggle } = useToggle(false)

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