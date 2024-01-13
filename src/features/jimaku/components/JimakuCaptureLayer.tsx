import { Fragment, useCallback, useContext, useRef, useState } from 'react';
import { getTimeStamp, randomString, toStreamingTime } from '~utils/misc';

import { sendForward } from '~background/forwards';
import StreamInfoContext from '~contexts/StreamInfoContexts';
import db from '~database';
import { useBLiveSubscriber } from '~hooks/message';
import { parseJimaku } from '~utils/bilibili';
import ButtonArea from './ButtonArea';
import JimakuArea from './JimakuArea';
import type { Jimaku } from "./JimakuLine";
import { useTransaction } from '~hooks/optimizer';
import JimakuFeatureContext from '~contexts/JimakuFeatureContext';

export type JimakuCaptureLayerProps = {
    offlineRecords: Jimaku[]
}

function JimakuCaptureLayer(props: JimakuCaptureLayerProps): JSX.Element {

    const { settings, info } = useContext(StreamInfoContext)
    const { jimakuZone: jimakuStyle, danmakuZone, jimakuPopupWindow } = useContext(JimakuFeatureContext)
    const { offlineRecords } = props

    const {
        common: { useStreamingTime },
        enabledRecording
    } = settings["settings.features"]

    const { regex, color, position } = danmakuZone
    const { tongchuanBlackList, tongchuanMans } = settings['settings.listings']

    const [jimaku, setJimaku] = useState<Jimaku[]>(offlineRecords)
    const clearJimaku = useCallback(() => setJimaku([]), [])

    // 離線時，setJimaku 將在離線時永不觸發，因此 ButtonArea 可以透過 props.jimaku 進行下載字幕
    const push = useTransaction<Jimaku>(500, (jimaku) => {
        setJimaku((prev) => jimakuStyle.order === 'top' ? [jimaku, ...prev] : [...prev, jimaku])
        if (enabledRecording.includes('jimaku')) {
            db.jimakus
                .add({ ...jimaku, room: info.room })
                .then(() => console.debug(`[BJF] ${jimaku.uname}(${jimaku.uid}) 的同传弹幕已记录`))
                .catch((err) => console.error(`[BJF] ${jimaku.uname}(${jimaku.uid}) 的同传弹幕记录失败`, err))
        }
    })

    // 此處同理
    // 由於沒有注入適配器，此處的訊息監聽器不會被觸發
    useBLiveSubscriber('DANMU_MSG', (data) => {
        // 超大型字体
        if (Array.isArray(data.info[1])) return
        const uid = data.info[2][0]
        const uname = data.info[2][1]
        const text = data.info[1]
        const ul = data.info[4][0]
        // do filtering
        if (tongchuanBlackList.some(u => u.id === uid.toString())) {
            console.debug(`用户 ${uname}(${uid}) 在同传黑名单内, 已略过。`)
            return
        }
        const isTranslator = tongchuanMans.some(u => u.id === uid.toString())
        if (ul < jimakuStyle.filterUserLevel && !isTranslator) return
        let jimaku = parseJimaku(text, regex)
        if (jimaku === undefined && isTranslator) {
            jimaku = text
        }
        if (jimaku === undefined) return
        console.debug(`[BJF] ${uname}: ${jimaku}`)
        // const jimaku = data.info[1]
        //console.info(`[BJF] ${data.info[2][1]} => ${data.info[1]} (${data.info[0][5]})`)
        const datetime = useStreamingTime ? toStreamingTime(info.liveTime) : getTimeStamp()
        const jimakuBlock = {
            date: datetime,
            text: jimaku,
            uid: data.info[2][0],
            uname: data.info[2][1],
            hash: randomString() + Date.now() + data.info[0][5],
        }
        push(jimakuBlock)
        if (jimakuPopupWindow) {
            sendForward('pages', 'jimaku', { date: datetime, text: jimaku, room: info.room })
        }
        // change color and position
        if (color) {
            data.info[0][3] = parseInt(color.substring(1), 16)
        }
        if (position !== 'unchanged') {
            data.info[0][1] = position === 'top' ? 5 : 4
        }

    })

    return (
        <Fragment>
            {info.status === 'online' && <JimakuArea jimaku={jimaku} />}
            {(info.status === 'online' || (enabledRecording.includes('jimaku') && jimaku.length > 0)) &&
                <ButtonArea jimakus={jimaku} clearJimaku={clearJimaku} />
            }
        </Fragment>
    )
}

export default JimakuCaptureLayer