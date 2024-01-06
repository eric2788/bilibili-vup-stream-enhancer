import { Button, Drawer, IconButton, Typography } from "@material-tailwind/react"

import FooterButton from "./FooterButton";
import { Fragment } from "react"
import type { Settings } from "~settings"
import type { StreamInfo } from "~api/bilibili"
import extIcon from 'raw:~assets/icon.png';
import { sendForward } from "~background/forwards"
import { sendMessager } from "~utils/messaging"
import { usePopupWindow } from "~hooks/window"
import { useToggle } from "@react-hooks-library/core"
import { useWebScreenChange } from "~hooks/bilibili"

export type AppProps = {
  roomId: string
  settings: Settings
  info: StreamInfo
}


function App(props: AppProps): JSX.Element {

  const { info, settings, roomId } = props

  const {
    "settings.display": displaySettings,
    "settings.features": featureSettings,
  } = settings

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

  const { createPopupWindow } = usePopupWindow(featureSettings.enabledPip, {
    width: 700,
    height: 500,
  })

  const restart = () => sendForward('background', 'redirect', { target: 'content-script', command: 'command', body: { command: 'restart' }, queryInfo: { url: location.href } })
  const addBlackList = () => confirm(`确定添加房间 ${roomId} 到黑名单?`) && sendMessager('add-black-list', { roomId })
  const openSettings = () => sendMessager('open-tab', { tab: 'settings' })
  const openMonitor = createPopupWindow(`stream.html`, {
    roomId,
    title: props.info.title,
    owner: props.info.username
  })

  const url = (url: string) => () => sendMessager('open-tab', { url })

  return (
    <Fragment>
      <div onClick={toggle} className="cursor-pointer group fixed flex justify-end top-72 left-0 rounded-r-2xl shadow-md p-3 bg-white dark:bg-gray-800 transition-transform transform -ml-6 w-28 hover:translate-x-5 overflow-hidden">
        <button className="flex flex-col justify-center items-center text-center gap-3">
          <img src={extIcon} alt="bjf" height={26} width={26} className="group-hover:animate-pulse" />
          <span className="text-md text-gray-800 dark:text-white">功能菜单</span>
        </button>
      </div>
      <Drawer placement={screenStatus === 'normal' ? 'right' : 'left'} open={open} onClose={closeDrawer} className={`p-4 bg-gray-300 dark:bg-gray-800 shadow-md`}>
        <main className="flex flex-col justify-between h-full">
          <section>
            <div className="mb-3 flex items-center justify-between text-ellipsis">
              <div className="flex justify-start items-start flex-col">
                <Typography variant="h5" className="dark:text-white">
                  {info.title}
                </Typography>
                <Typography variant="small" className="dark:text-white">
                  {info.username} 的直播间
                </Typography>
              </div>
              <IconButton variant="text" onClick={closeDrawer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </div>
            <div id="bjf-global-buttons" className="flex flex-col px-2 py-3 gap-4">
              {displaySettings.blackListButton &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={addBlackList}>添加到黑名单</Button>}
              {displaySettings.settingsButton &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={openSettings}>进入设置</Button>}
              {displaySettings.restartButton &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={restart}>重新启动</Button>}
              {featureSettings.monitorWindow &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={openMonitor}>打开监控式视窗</Button>}
            </div>
          </section>
          <footer>
            <Typography variant="small">
              Bilibili Jimaku Filter - vup观众直播增强扩展
            </Typography>
            <hr className="py-3 border-black dark:border-gray-700" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
              <FooterButton title="查看源代码" onClick={url('https://github.com/eric2788/bilibili-jimaku-filter')}>
                <svg className="h-10 w-10 text-black" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.891 1.529 2.341 1.089 2.91.833.091-.646.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 7.07c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.547 1.376.203 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.934.359.31.678.919.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
                </svg>
              </FooterButton>
              <FooterButton title="联络作者" onClick={url('https://tg.me/Eric1008818')}>
                <svg className="h-10 w-10 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-2.98846.01069.00848.00683-.059s4.885-4.44751,5.084-4.637c.20147-.189.135-.23.135-.23.01147-.23053-.36152,0-.36152,0L8.16632,13.299l-2.69549-.918s-.414-.1485-.453-.475c-.041-.324.46649-.5.46649-.5l10.717-4.25751s.881-.39252.881.25751Z" />
                </svg>
              </FooterButton>
              <FooterButton title="贡献指南">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-black">
                  <path fillRule="evenodd" d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
              </FooterButton>
              <FooterButton title="使用教程">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-black">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </FooterButton>
            </div>
          </footer>
        </main>
      </Drawer>
    </Fragment>
  )
}


export default App