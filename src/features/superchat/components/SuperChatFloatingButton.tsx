import { Item, Menu, useContextMenu } from 'react-contexify';

import DraggableFloatingButton from '~components/DraggableFloatingButton';
import ShadowRoot from '~components/ShadowRoot';
import styleText from 'data-text:react-contexify/dist/ReactContexify.css';

export type SuperChatFloatingButtonProps = {
    children: React.ReactNode
}

function SuperChatFloatingButton({ children }: SuperChatFloatingButtonProps): JSX.Element {

    const { show } = useContextMenu({
        id: 'superchat-menu'
    })

    return (
        <ShadowRoot>
            <style>{styleText}</style>
            <DraggableFloatingButton onClick={e => show({ event: e })}>
                <div className="group-hover:animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 7.5 3 4.5m0 0 3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div>醒目留言</div>
            </DraggableFloatingButton>
            <Menu onKeyDown={e => e.preventDefault()} id="superchat-menu" style={{ backgroundColor: '#f1f1f1', overscrollBehaviorY: 'none' }}>
                <Item className='hidden'>{''}</Item>
                {children}
            </Menu>
        </ShadowRoot>
    )
}

export default SuperChatFloatingButton