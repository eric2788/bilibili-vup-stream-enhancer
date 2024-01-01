import { Fragment, useRef, useState } from 'react';
import { sendForward } from '~background/forwards';
import db from '~database';
import { useBLiveMessageCommand } from '~hooks/message';
import { getTimeStamp, randomString, toStreamingTime } from '~utils/misc';

import { useInterval } from '@react-hooks-library/core';

import { parseJimaku } from '../';
import ButtonArea from './ButtonArea';
import JimakuArea from './JimakuArea';

import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~settings";
import type { Jimaku } from "./JimakuLine";


export type JimakuCaptureLayerProps = {
    offlineRecords: Jimaku[]
    settings: Settings
    info: StreamInfo
}

function JimakuCaptureLayer(props: JimakuCaptureLayerProps): JSX.Element {

    const { settings, info, offlineRecords } = props

    const { jimakuPopupWindow, useStreamingTime, enabledRecording } = settings["settings.features"]
    const { regex } = settings['settings.danmaku']
    const jimakuStyle = settings['settings.jimaku']

    const [jimaku, setJimaku] = useState<Jimaku[]>(offlineRecords)
    const transactions = useRef<Jimaku[]>([])

    // 離線時，由於沒有注入適配器，此處的訊息監聽器不會被觸發
    useBLiveMessageCommand('DANMU_MSG', (data) => {
        const jimaku = parseJimaku(data.info[1], regex)
        //if (jimaku === undefined) return
        console.info(`[BJF] ${data.info[2][1]} => ${data.info[1]} (${data.info[0][5]})`)
        const datetime = useStreamingTime ? toStreamingTime(info.liveTime) : getTimeStamp()
        const jimakuBlock = {
            date: datetime,
            text: data.info[1],
            uid: data.info[2][0],
            uname: data.info[2][1],
            hash: randomString() + Date.now() + data.info[0][5],
        }
        transactions.current.push(jimakuBlock)
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
                .then(() => console.info(`[BJF] ${jimaku.uname}(${jimaku.uid}) 的同传弹幕已记录`))
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