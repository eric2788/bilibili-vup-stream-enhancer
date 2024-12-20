import { Button } from "@material-tailwind/react"
import { useCallback, useContext } from "react"
import { sendForward } from "~background/forwards"
import ContentContext from "~contexts/ContentContexts"
import { usePopupWindow } from "~hooks/window"
import { sendMessager } from "~utils/messaging"


function ButtonList(): JSX.Element {

    const streamInfo = useContext(ContentContext)
    
    const { settings, info } = streamInfo
    const { "settings.display": displaySettings, "settings.features": { common: { enabledPip, monitorWindow }} } = settings

    const { createPopupWindow } = usePopupWindow(enabledPip, {
        width: 700,
        height: 450
    })

    const restart = useCallback(() => sendForward('background', 'redirect', { target: 'content-script', command: 'command', body: { command: 'restart' }, queryInfo: { url: '*://live.bilibili.com/*' } }), [])
    const addBlackList = () => confirm(`确定添加房间 ${info.room}${info.room === info.shortRoom ? '' : `(${info.shortRoom})`} 到黑名单?`) && sendMessager('add-black-list', { roomId: info.room })
    const openSettings = useCallback(() => sendMessager('open-options'), [])
    const openMonitor = createPopupWindow(`stream.html`, {
        roomId: info.room,
        title: info.title,
        owner: info.username,
        muted: enabledPip.toString() //in iframe, only muted video can autoplay
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
                <Button variant="outlined" size="lg" className="text-lg" onClick={openMonitor}>弹出直播视窗</Button>}
            {(info.isTheme && displaySettings.themeToNormalButton) && 
                <Button variant="outlined" size="lg" className="text-lg" onClick={() => window.open(`https://live.bilibili.com/blanc/${info.room}`)}>返回非海报界面</Button>    
            }
        </div>
    )
}

export default ButtonList