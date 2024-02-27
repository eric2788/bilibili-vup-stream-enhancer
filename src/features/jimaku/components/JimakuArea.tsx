import { Fragment, useContext, useEffect, useMemo, useState } from 'react';

import styled from '@emotion/styled';
import { Rnd } from 'react-rnd';
import ConditionalWrapper from '~components/ConditionalWrapper';
import JimakuFeatureContext from '~contexts/JimakuFeatureContext';
import StreamInfoContext from '~contexts/StreamInfoContexts';
import { useWebScreenChange } from '~hooks/bilibili';
import { useTeleport } from '~hooks/teleport';
import type { JimakuSchema } from '~settings/features/jimaku/components/JimakuFragment';
import { rgba } from '~utils/misc';
import type { Jimaku } from "./JimakuLine";
import JimakuList from './JimakuList';
import JimakuVisibleButton from './JimakuVisibleButton';

const createJimakuScope = (jimakuStyle: JimakuSchema) => styled.div`

        .subtitle-normal::-webkit-scrollbar {
            width: 5px;
        }

        .subtitle-normal::-webkit-scrollbar-track {
            background-color: ${jimakuStyle.backgroundColor};
        }

        .subtitle-normal::-webkit-scrollbar-thumb {
            background-color: ${jimakuStyle.color};
        }

        #subtitle-list p:${jimakuStyle.order === 'top' ? 'first' : 'last'}-of-type {
            animation: ${jimakuStyle.animation} .3s ease-out;
            font-size: ${jimakuStyle.firstLineSize}px;
        }

        #subtitle-list p {
            font-weight: bold;
            color: ${jimakuStyle.color}; 
            opacity: 1.0; 
            margin: ${jimakuStyle.lineGap}px 0px;
            font-size: ${jimakuStyle.size}px;  
        }
        `

export type JimakuAreaProps = {
    jimaku: Jimaku[]
}

function JimakuArea({ jimaku }: JimakuAreaProps): JSX.Element {

    const { settings, info: { isTheme } } = useContext(StreamInfoContext)
    const { jimakuZone: jimakuStyle } = useContext(JimakuFeatureContext)

    const dev = settings['settings.developer']

    const Area = useMemo(() => createJimakuScope(jimakuStyle), [jimakuStyle])

    useEffect(() => {
        // make danmaku chat list peer with video 
        const chatListArea = document.querySelector(dev.elements.videoArea) as HTMLDivElement
        if (!isTheme) {
            chatListArea.style.marginBottom = `${jimakuStyle.backgroundHeight + 30}px`
        }
        return () => {
            document.querySelector('div#jimaku-full-area')?.remove()
            delete chatListArea.style.marginBottom
        }
    }, [])

    const screenStatus = useWebScreenChange(dev.classes)

    const { Teleport, rootContainer } = useTeleport(screenStatus, {
        parentQuerySelector: dev.elements.jimakuFullArea,
        id: 'jimaku-full-area',
        placement: (parent, child) => {
            parent.insertAdjacentElement('afterend', child)
        },
        shouldPlace: (status) => status !== 'normal' || isTheme
    })

    const subTitleStyle: React.CSSProperties = {
        height: jimakuStyle.backgroundHeight,
        backgroundColor: jimakuStyle.backgroundColor,
        color: jimakuStyle.color,
        fontSize: jimakuStyle.size,
        textAlign: jimakuStyle.position,
    }

    const [visible, setVisible] = useState(true)

    if (screenStatus !== 'normal' || isTheme) {
        subTitleStyle.position = 'absolute'
        subTitleStyle.cursor = 'move'
        subTitleStyle.width = '100%'
        subTitleStyle.height = '100%'
        subTitleStyle.backgroundColor = rgba(jimakuStyle.backgroundColor, (jimakuStyle.backgroundOpacity / 100))
    }

    return (
        <Fragment>
            <Teleport container={rootContainer}>
                <Area>
                    <ConditionalWrapper
                        as={Rnd}
                        condition={screenStatus !== 'normal' || isTheme}
                        bounds={dev.elements.webPlayer}
                        style={{ zIndex: 9999, display: visible ? 'block' : 'none' }}
                        minHeight={100}
                        minWidth={200}
                        scale={0.93}
                        default={{
                            x: 100,
                            y: -300,
                            width: '50%',
                            height: jimakuStyle.backgroundHeight,
                        }}
                    >
                        <JimakuList
                            jimaku={jimaku}
                            style={subTitleStyle}
                        />
                    </ConditionalWrapper>
                </Area>
            </Teleport>
            {screenStatus !== 'normal' && <JimakuVisibleButton visible={visible} toggle={() => setVisible(!visible)} dev={dev} />}
        </Fragment>
    )
}


export default JimakuArea