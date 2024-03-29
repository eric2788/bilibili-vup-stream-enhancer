import { Item, Menu, useContextMenu } from 'react-contexify';
import styleText from 'data-text:react-contexify/dist/ReactContexify.css';
import { Fragment, useContext } from 'react';
import DraggableFloatingButton from '~components/DraggableFloatingButton';
import BJFThemeDarkContext from '~contexts/BLiveThemeDarkContext';
import SuperChatFeatureContext from '~contexts/SuperChatFeatureContext';

export type SuperChatFloatingButtonProps = {
    children: React.ReactNode
}

function SuperChatFloatingButton({ children }: SuperChatFloatingButtonProps): JSX.Element {

    const [themeDark] = useContext(BJFThemeDarkContext)
    const { floatingButtonColor } = useContext(SuperChatFeatureContext)

    const { show } = useContextMenu({
        id: 'superchat-menu'
    })

    return (
        <Fragment>
            <style>{styleText}</style>
            <DraggableFloatingButton style={{ backgroundColor: themeDark ? '#424242' : floatingButtonColor }} onClick={e => show({ event: e })} className='hover:brightness-90 duration-150 dark:bg-gray-700 dark:hover:bg-gray-800 text-white'>
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
        </Fragment>
    )
}

export default SuperChatFloatingButton