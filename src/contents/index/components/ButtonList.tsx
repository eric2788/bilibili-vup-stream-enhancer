import { Button } from "@material-tailwind/react"
import { useContext } from "react"
import { sendForward } from "~background/forwards"
import StreamInfoContext from "~contexts/StreamInfoContexts"
import { usePopupWindow } from "~hooks/window"
import { sendMessager } from "~utils/messaging"


function ButtonList(): JSX.Element {

    const streamInfo = useContext(StreamInfoContext)
    
    const { settings, info } = streamInfo
    const { "settings.display": displaySettings, "settings.features": { common: { enabledPip, monitorWindow }} } = settings

    const { createPopupWindow } = usePopupWindow(enabledPip, {
        width: 700,
        height: 450
    })

    const restart = () => sendForward('background', 'redirect', { target: 'content-script', command: 'command', body: { command: 'restart' }, queryInfo: { url: '*://live.bilibili.com/*' } })
    const addBlackList = () => confirm(`确定添加房间 ${info.room}${info.room === info.shortRoom ? '' : `(${info.shortRoom})`} 到黑名单?`) && sendMessager('add-black-list', { roomId: info.room })
    const openSettings = () => sendMessager('open-tab', { tab: 'settings' })
    const openMonitor = createPopupWindow(`stream.html`, {
        roomId: info.room,
        title: info.title,
        owner: info.username
    })

    return (
        <div id="bjf-global-buttons" className="flex flex-col px-2 py-3 gap-4">
            {displaySettings.blackListButton &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={addBlackList}>添加到黑名单</Button>}
            {displaySettings.settingsButton &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={openSettings}>进入设置</Button>}
            {displaySettings.restartButton &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={restart}>重新启动</Button>}
            {monitorWindow &&
                <Button variant="outlined" size="lg" className="text-lg" onClick={openMonitor}>打开监控式视窗</Button>}
            {(info.isTheme && displaySettings.themeToNormalButton) && 
                <Button variant="outlined" size="lg" className="text-lg" onClick={() => window.open(`https://live.bilibili.com/blanc/${info.room}`)}>返回非海报界面</Button>    
            }
        </div>
    )
}

export default ButtonList