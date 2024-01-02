
import '~tailwindcss';

import { Fragment, memo, useEffect, useRef, useState } from 'react';
import VirtualScroller from 'virtual-scroller/react';
import BJFThemeProvider from '~components/BJFThemeProvider';
import { useForwarder } from '~hooks/forwarder';

import {
    Checkbox, IconButton, List, ListItem, Menu, MenuHandler, MenuItem, MenuList, Navbar, Typography
} from '@material-tailwind/react';

export type Jimaku = {
    text: string
    date: string
    hash: string
}

const urlParams = new URLSearchParams(window.location.search)
const roomId = urlParams.get('roomId')
const roomTitle = urlParams.get('title')

function JimakuPage(): JSX.Element {

    const [title, setTitle] = useState('加载中')
    const [openNav, setOpenNav] = useState(false);
    const [keepBottom, setKeepBottom] = useState(true);
    const bottomRef = useRef(keepBottom)

    useEffect(() => {
        bottomRef.current = keepBottom
    }, [keepBottom])

    const [messages, setMessages] = useState<Jimaku[]>([])

    const forwarder = useForwarder('jimaku', 'pages')

    useEffect(() => {
        if (bottomRef.current) {
            window.scrollTo(0, document.body.scrollHeight)
        }
    }, [messages])

    useEffect(() => {
        if (roomId) {
            setTitle(roomTitle ?? `B站直播间 ${roomId} 的同传弹幕视窗`)
            forwarder.addHandler((message) => {
                if (message.room !== roomId) return
                setMessages(messages => [...messages, message])
            })
        } else {
            alert('未知房间Id, 此同传弹幕视窗不会运行。')
        }
    }, []);

    return (
        <Fragment>
            <Navbar className="sticky top-0 z-10 shadow-md w-full max-w-full px-6 py-3 bg-gray-800 dark:bg-gray-800 rounded-none ring-0 border-0">
                <div className="flex items-center justify-between">
                    <Typography
                        variant="h5"
                        className="mr-4 py-1.5 text-gray-100"
                    >
                        {title}
                    </Typography>
                    <Menu
                        open={openNav}
                        handler={setOpenNav}
                        dismiss={{
                            enabled: true,
                            escapeKey: true,
                            itemPress: false,
                            outsidePress: true
                        }}
                    >
                        <MenuHandler>
                            <IconButton
                                variant="text"
                                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-100 ease-in-out"
                                ripple={false}
                                onClick={() => setOpenNav(!openNav)}
                            >
                                {openNav ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>

                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>

                                )}
                            </IconButton>
                        </MenuHandler>
                        <MenuList className="p-0">
                            <MenuItem className="p-0 overflow-hidden">
                                <label className="flex w-full cursor-pointer items-center px-3 py-2">
                                    <Checkbox
                                        ripple={false}
                                        crossOrigin={'annymous'}
                                        label="自動置底"
                                        checked={keepBottom}
                                        onChange={e => setKeepBottom(e.target.checked)}
                                    />
                                </label>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Navbar>
            <div className="container w-full max-w-full">
                <List className="overflow-y-auto">
                    <VirtualScroller
                        items={messages}
                        itemComponent={memo(MessageItem)}
                    />
                </List>
            </div>
        </Fragment>
    )
}


function MessageItem({ item: jimaku }: { item: Jimaku }): JSX.Element {
    return (
        <ListItem key={jimaku.hash} className="dark:text-white dark:hover:text-white dark:focus:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700" ripple={false}>
            【{jimaku.date}】{jimaku.text}
        </ListItem>
    )
}


function JimakuApp(): JSX.Element {
    return (
        <BJFThemeProvider>
            <JimakuPage />
        </BJFThemeProvider>
    )
}


export default JimakuApp