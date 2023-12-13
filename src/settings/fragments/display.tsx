import { List, ListItemPrefix, Checkbox, Typography, ListItem, Tooltip } from "@material-tailwind/react"
import { Fragment, type ChangeEvent } from "react"
import type { StateProxy } from "~hooks/binding"



export type SettingSchema = {
    restartButton: boolean
    blackListButton: boolean
    settingsButton: boolean
    themeToNormalButton: boolean
}


export const defaultSettings: Readonly<SettingSchema> = {
    restartButton: false,
    blackListButton: true,
    settingsButton: true,
    themeToNormalButton: true,
}

export const title = '界面按钮显示'

function DisplaySettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {


    const checker = useHandler<ChangeEvent<HTMLInputElement>, boolean>((e) => e.target.checked)

    return (
        <Fragment>
            <List className="md:col-span-2 max-md:col-span-1">
                <ListItem className="p-0">
                    <label
                        htmlFor="restartButton"
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                    >
                        <ListItemPrefix className="mr-3">
                            <Checkbox
                                onChange={checker('restartButton')}
                                checked={state.restartButton}
                                crossOrigin={'annoymous'}
                                id="restartButton"
                                ripple={false}
                                className="hover:before:opacity-0"
                                containerProps={{
                                    className: "p-0",
                                }}
                            />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium">
                            重新启动按钮
                        </Typography>
                    </label>
                </ListItem>
                <ListItem className="p-0">
                    <label
                        htmlFor="blackListButton"
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                    >
                        <ListItemPrefix className="mr-3">
                            <Checkbox
                                onChange={checker('blackListButton')}
                                checked={state.blackListButton}
                                crossOrigin={'annoymous'}
                                id="blackListButton"
                                ripple={false}
                                className="hover:before:opacity-0"
                                containerProps={{
                                    className: "p-0",
                                }}
                            />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium flex gap-1 items-center">
                            添加到黑名单的按钮
                            <Tooltip content="别担心，在页面右键打开菜单仍可进行添加黑名单的动作。">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-sm">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            </Tooltip>
                        </Typography>
                    </label>
                </ListItem>
                <ListItem className="p-0">
                    <label
                        htmlFor="settingsButton"
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                    >
                        <ListItemPrefix className="mr-3">
                            <Checkbox
                                onChange={checker('settingsButton')}
                                checked={state.settingsButton}
                                crossOrigin={'annoymous'}
                                id="settingsButton"
                                ripple={false}
                                className="hover:before:opacity-0"
                                containerProps={{
                                    className: "p-0",
                                }}
                            />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium flex gap-1 items-center">
                            设定按钮
                            <Tooltip content="一般情况下，你可透过点击浏览器扩展图标来进入设定界面">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-sm">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            </Tooltip>
                        </Typography>
                    </label>
                </ListItem>
                <ListItem className="p-0">
                    <label
                        htmlFor="themeToNormalButton"
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                    >
                        <ListItemPrefix className="mr-3">
                            <Checkbox
                                onChange={checker('themeToNormalButton')}
                                checked={state.themeToNormalButton}
                                crossOrigin={'annoymous'}
                                id="themeToNormalButton"
                                ripple={false}
                                className="hover:before:opacity-0"
                                containerProps={{
                                    className: "p-0",
                                }}
                            />
                        </ListItemPrefix>
                        <Typography color="blue-gray" className="font-medium">
                            大海报房间新增返回正常房间按钮
                        </Typography>
                    </label>
                </ListItem>
            </List>
        </Fragment>
    )
}


export default DisplaySettings