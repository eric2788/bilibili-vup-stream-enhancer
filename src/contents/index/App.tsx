import { Drawer } from "@material-tailwind/react";

import { useToggle } from "@react-hooks-library/core";
import { Fragment, useContext, useMemo, useRef } from "react";
import Tutorial, { type TutorialRefProps, type TutorialStep } from "~components/Tutorial";
import GenericContext from "~contexts/GenericContext";
import ContentContext from "~contexts/ContentContexts";
import { useWebScreenChange } from "~hooks/bilibili";
import ButtonList from "./components/ButtonList";
import FloatingMenuButton from "./components/FloatingMenuButtion";
import Footer from "./components/Footer";
import Header from "./components/Header";

const shadowRoot = () => document.querySelector('bjf-csui').shadowRoot

const steps: Array<TutorialStep> = [
  {
    target: '#bjf-main-menu-button',
    content: '此处是主菜单按钮，点击可以展开主菜单区块来执行各种操作。',
    beforeLeave: e => e.click()
  },
  {
    target: '#bjf-main-menu',
    content: '此处为主菜单区块，大致分为上方资讯，全局按钮区块以及底部跳转按钮区块。',
    disableOverlay: true,
    beforeLeave: () => (shadowRoot().querySelector('#bjf-main-menu-button') as HTMLElement).click()
  },
  {
    target: '#bjf-global-buttons',
    content: '此处为全局按钮区块，包含了一些全局性的操作按钮，你可以透过调整界面显示设定来控制按钮的数量。',
    disableOverlay: true,
    beforeLeave: () => (shadowRoot().querySelector('#bjf-main-menu-button') as HTMLElement).click()
  },
  {
    target: '#bjf-main-menu footer',
    content: '此处为底部区块，此处的按钮全部都会跳转到页面以外，把鼠标移到按钮上可以进一步查看其跳转资讯。',
    disableOverlay: true,
    beforeLeave: () => (shadowRoot().querySelector('#bjf-main-menu-button') as HTMLElement).click()
  },
  {
    target: 'button[title="使用导航"]',
    content: '点击这个按钮可以重新查看本导航。',
    disableOverlay: true,
    placement: 'top-start',
    beforeLeave: () => (shadowRoot().querySelector('#bjf-main-menu-button') as HTMLElement).click()
  },
  {
    target: '#bjf-main-menu',
    disableOverlay: true,
    content: (
      <>
        <p>以上为本扩展页面渲染的主要内容。</p>
        <p>至于功能内容的界面渲染，他们将基于你的设定在本页面进行显示，你可以透过点击各式的按钮来尝试体验。</p>
        <p>最后，你可以通过点击主菜单区块外来关闭此主菜单区块。</p>
      </>
    )
  }
]

function App(): JSX.Element {

  const streamInfo = useContext(ContentContext)

  // i don't know why the hell this got rendered at the top level during HMR, should be the bug for plasmo
  if (!streamInfo) {
    console.warn('plasmo framework bug: streamInfo is undefined')
    return <></>
  }

  const { info, settings } = streamInfo

  const { "settings.display": displaySettings, "settings.developer": developerSettings } = settings

  // 狀態為離綫時，除非强制啓動為 true
  // 此處不需要顯示按鈕
  // 離綫下載按鈕交給 feature UI 處理
  if (info.status === 'offline') {
    return <></>
  }

  const screenStatus = useWebScreenChange(developerSettings.classes)
  const { bool: open, setFalse: closeDrawer, toggle } = useToggle(false)

  const tutorialRef = useRef<TutorialRefProps>()

  const realSteps = steps.map(step => ({
    ...step,
    target: typeof step.target === 'string' ? shadowRoot().querySelector(step.target) : step.target
  } as TutorialStep))

  if (screenStatus !== 'normal' && !displaySettings.supportWebFullScreen) {
    return <></>
  }

  return (
    <Fragment>
      <Tutorial ref={tutorialRef} stateKey="content" steps={realSteps} noScroll />
      <FloatingMenuButton toggle={toggle} />
      <Drawer id="bjf-main-menu" placement={screenStatus === 'normal' ? 'right' : 'left'} open={open} onClose={closeDrawer} className={`p-4 bg-gray-300 dark:bg-gray-800 shadow-md`}>
        <main className="flex flex-col justify-between h-full">
          <section>
            <Header closeDrawer={closeDrawer} />
            <ButtonList />
          </section>
          <GenericContext.Provider value={tutorialRef}>
            <Footer />
          </GenericContext.Provider>
        </main>
      </Drawer>
    </Fragment>
  )
}


export default App