import { Fragment, useRef, useState } from 'react';
import { getTimeStamp, randomString, toStreamingTime } from '~utils/misc';

import ButtonArea from './ButtonArea';
import type { Jimaku } from "./JimakuLine";
import JimakuArea from './JimakuArea';
import type { Settings } from "~settings";
import type { StreamInfo } from "~api/bilibili";
import db from '~database';
import { parseJimaku } from '~utils/bilibili';
import { sendForward } from '~background/forwards';
import { useBLiveSubscriber } from '~hooks/message';
import { useInterval } from '@react-hooks-library/core';

export type JimakuCaptureLayerProps = {
    offlineRecords: Jimaku[]
    settings: Settings
    info: StreamInfo
}

function JimakuCaptureLayer(props: JimakuCaptureLayerProps): JSX.Element {

    const { settings, info, offlineRecords } = props

    const { jimakuPopupWindow, useStreamingTime, enabledRecording } = settings["settings.features"]
    const { regex, color, position } = settings['settings.danmaku']
    const jimakuStyle = settings['settings.jimaku']
    const { tongchuanBlackList, tongchuanMans } = settings['settings.listings']

    const [jimaku, setJimaku] = useState<Jimaku[]>(offlineRecords)
    const transactions = useRef<Jimaku[]>([])

    // 離線時，由於沒有注入適配器，此處的訊息監聽器不會被觸發
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
        console.info(`[BJF] ${uname}: ${jimaku}`)
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
        transactions.current.push(jimakuBlock)
        // change color and position
        if (color) {
            data.info[0][3] = parseInt(color.substring(1), 16)
        }
        if (position !== 'unchanged') {
            data.info[0][1] = position === 'top' ? 5 : 4
        }
    })

    // 此處同理
    // setJimaku 將在離線時永不觸發，因此 ButtonArea 可以透過 props.jimaku 進行下載字幕
    useInterval(() => {
        if (transactions.current.length === 0) return
        const jimaku = transactions.current.shift()
        setJimaku((prev) => jimakuStyle.order === 'top' ? [jimaku, ...prev] : [...prev, jimaku])
        if (jimakuPopupWindow) {
            sendForward('pages', 'jimaku', { date: jimaku.date, text: jimaku.text, room: info.room })
        }
        if (enabledRecording.includes('jimaku')) {
            db.jimakus
                .add({ ...jimaku, room: info.room })
                .then(() => console.debug(`[BJF] ${jimaku.uname}(${jimaku.uid}) 的同传弹幕已记录`))
                .catch((err) => console.error(`[BJF] ${jimaku.uname}(${jimaku.uid}) 的同传弹幕记录失败`, err))
        }
    }, 500)

    return (
        <Fragment>
            {info.status === 'online' && <JimakuArea settings={settings} jimaku={jimaku} />}
            {(info.status === 'online' || enabledRecording.includes('jimaku')) &&
                <ButtonArea jimakus={jimaku} settings={settings} info={info} clearJimaku={() => setJimaku([])} />
            }
        </Fragment>
    )
}

export default JimakuCaptureLayer