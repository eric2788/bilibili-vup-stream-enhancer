

import styleText from 'data-text:react-contexify/dist/ReactContexify.css';
import { useDeferredValue, useState } from 'react';
import { Menu, useContextMenu } from 'react-contexify';
import { Rnd } from 'react-rnd';
import type { StreamInfo } from '~api/bilibili';
import ShadowRoot from '~components/ShadowRoot';
import type { Settings } from '~settings';
import SuperChatArea from './SuperChatArea';

export type SuperChatFloatingButtonProps = {
    settings: Settings
    info: StreamInfo
}


function SuperChatFloatingButton(props: SuperChatFloatingButtonProps): JSX.Element {

    const { settings, info } = props

    const [position, setPosition] = useState({ x: 48, y: 96 })
    const pos = useDeferredValue(position)

    const { show } = useContextMenu({
        id: 'superchat-menu'
    })

    return (
        <ShadowRoot>
            <style>{styleText}</style>
            <button
                onClick={e => show({ event: e })}
                style={{
                    left: pos.x,
                    top: pos.y,
                    width: 85,
                    height: 85
                }}
                className="absolute rounded-full bg-red-600 duration-150 hover:bg-red-700 dark:bg-gray-700 dark:hover:bg-gray-800 p-3 drop-shadow-lg flex flex-col justify-center items-center gap-3 text-white">
                <div className="hover:animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 7.5 3 4.5m0 0 3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div>醒目留言</div>
            </button>
            <Rnd
                bounds={document.body}
                enableResizing={false}
                className="rounded-full fixed"
                onDrag={(_, d) => setPosition({ x: (d.x - 60), y: (d.y - 5) })}
                default={{
                    x: 108,
                    y: 101,
                    width: 25,
                    height: 25,
                }}
            >
                <div className="w-full h-full rounded-full bg-white flex justify-center items-center">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x={0} y={0}
                        viewBox="0 0 18 18" enableBackground="new 0 0 18 18" xmlSpace="preserve">
                        <path fill="#ffffff" d="M9,1L1,9l5.2,5.2L9,17l8-8L9,1z M7,12H6v-1h1V12z M7,7H6V6h1V7z M12,12h-1v-1h1V12z M11,6h1v1h-1V6z" />
                        <polygon points="15.6,9 13,6.2 13,8 9,8 5,8 5,6.2 2.4,9 5,11.8 5,10 9,10 13,10 13,11.8 " />
                        <polygon points="10,9 10,9 10,5 11.8,5 9,2.4 6.2,5 8,5 8,9 8,9 8,13 6.2,13 9,15.6 11.8,13 10,13 " />
                    </svg>
                </div>
            </Rnd>
            <Menu id="superchat-menu" style={{ backgroundColor: '#f1f1f1', overscrollBehaviorY: 'none' }}>
                <SuperChatArea settings={settings} info={info} />
            </Menu>
        </ShadowRoot>
    )
}

export default SuperChatFloatingButton