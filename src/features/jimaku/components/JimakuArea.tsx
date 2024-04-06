import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Rnd } from 'react-rnd';
import ConditionalWrapper from '~components/ConditionalWrapper';
import ContentContext from '~contexts/ContentContexts';
import JimakuFeatureContext from '~contexts/JimakuFeatureContext';
import { useWebScreenChange } from '~hooks/bilibili';
import { useTeleport } from '~hooks/teleport';
import type { JimakuSchema } from '~options/features/jimaku/components/JimakuFragment';
import { rgba } from '~utils/misc';
import type { Jimaku } from "./JimakuLine";
import JimakuList from './JimakuList';
import JimakuVisibleButton from './JimakuVisibleButton';
import ShadowStyle from '~components/ShadowStyle';
import TailwindScope from '~components/TailwindScope';

const createAreaStyleSheet = (jimakuStyle: JimakuSchema) => `

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

    const { settings, info: { isTheme } } = useContext(ContentContext)
    const { jimakuZone: jimakuStyle } = useContext(JimakuFeatureContext)

    const dev = settings['settings.developer']

    const areaCssText = useMemo(() => createAreaStyleSheet(jimakuStyle), [jimakuStyle])

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

    const shouldPutIntoLivePlayer = screenStatus !== 'normal' || isTheme

    const [ dragState, setDragState ] = useState<{ 
        x: number, 
        y: number, 
        width: string | number, 
        height: string | number 
    }>(() => ({ x: 100, y: -300, width: '50%', height: jimakuStyle.backgroundHeight }))

    const rmbState = jimakuStyle.rememberDragState

    return (
        <Fragment>
            <Teleport container={rootContainer}>
                <ConditionalWrapper
                    as={TailwindScope}
                    condition={shouldPutIntoLivePlayer}
                >
                    <ShadowStyle>{areaCssText}</ShadowStyle>
                    <ConditionalWrapper
                        as={Rnd}
                        bounds={jimakuStyle.areaDragBoundary ? dev.elements.webPlayer : undefined}
                        condition={shouldPutIntoLivePlayer}
                        style={{ zIndex: 3000, display: visible ? 'block' : 'none' }}
                        minHeight={100}
                        minWidth={200}
                        scale={0.93}
                        onDragStop={(e, d) => {
                            if (!rmbState) return
                            setDragState(state => ({ ...state, x: d.x, y: d.y }))
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            if (!rmbState) return
                            setDragState({
                                width: ref.style.width,
                                height: ref.style.height,
                                ...position
                            })
                        }}
                        default={dragState}
                    >
                        <JimakuList
                            jimaku={jimaku}
                            style={subTitleStyle}
                            fullScreen={screenStatus !== 'normal'}
                        />
                    </ConditionalWrapper>
                </ConditionalWrapper>
            </Teleport>
            {screenStatus !== 'normal' && <JimakuVisibleButton visible={visible} toggle={() => setVisible(!visible)} dev={dev} />}
        </Fragment>
    )
}


export default JimakuArea