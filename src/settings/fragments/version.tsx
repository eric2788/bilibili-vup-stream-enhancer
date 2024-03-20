import { Button, IconButton, List, Typography } from "@material-tailwind/react"
import { type ChangeEvent, Fragment, useState } from "react"
import { getLatestRelease, getRelease } from "~api/github"
import PromiseHandler from "~components/PromiseHandler"
import type { StateProxy } from "~hooks/binding"
import SwitchListItem from "~settings/components/SwitchListItem"
import type { ReleaseInfo } from "~types/github"
import semver from 'semver';


export type SettingSchema = {
    autoCheckUpdate: boolean,
}

export const defaultSettings: Readonly<SettingSchema> = {
    autoCheckUpdate: false,
}

export const title = '版本资讯'

export const description = `此设定区块包含了一些版本相关的设定, 你可以在这里调整各个版本相关的设定。`


async function getTwoReleaseInfo(): Promise<ReleaseInfo[]> {
    const currentVersion = chrome.runtime.getManifest().version
    const latest = getLatestRelease()
    const current = getRelease(currentVersion)
    return Promise.all([current, latest])
}


function VersionSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const bool = useHandler<ChangeEvent<HTMLInputElement>, boolean>(e => e.target.checked)

    const [fetcher, setFetcher] = useState(() => getTwoReleaseInfo)

    const refresh = () => setFetcher(() => () => getTwoReleaseInfo())

    return (
        <Fragment>
            <div className="col-span-2">
                <List>
                    <SwitchListItem
                        label="当检测到有新版本时提醒我"
                        value={state.autoCheckUpdate}
                        onChange={bool('autoCheckUpdate')}
                        hint="启用后，本扩展将不定期检查更新并在有新版本时提醒。"
                    />
                </List>
            </div>
            <div className="col-span-2">
                <PromiseHandler promise={fetcher}>
                    <PromiseHandler.Loading>
                        <div className="justify-between flex">
                            <Typography as="p">正在检查更新...</Typography>
                            <div className="ml-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-spin">
                                    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </PromiseHandler.Loading>
                    <PromiseHandler.Response>
                        {([current, last]: ReleaseInfo[]) => (
                            <div className="md:flex justify-between text-center md:text-left space-y-3 md:space-y-0">
                                <div>
                                    {semver.lt(current.tag_name, last.tag_name) ?
                                        (
                                            <Typography color="red" className="font-bold mb-4">你有可用的更新</Typography>
                                        ) :
                                        (
                                            <Typography color="green" className="font-semibold mb-4">你的版本已是最新</Typography>
                                        )
                                    }
                                    <Typography className="font-normal">当前版本: v{current.tag_name}</Typography>
                                    <Typography variant="small">发布日期: {new Date(current.published_at).toLocaleDateString()} | <a href={current.html_url} target="_blank" className="underline">更新日志</a></Typography>
                                    <Typography className="font-normal">Github 最新版本: v{last.tag_name}</Typography>
                                    <Typography variant="small">发布日期: {new Date(last.published_at).toLocaleDateString()} | <a href={last.html_url} target="_blank" className="underline">更新日志</a></Typography>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Button onClick={refresh} variant="outlined">刷新</Button>
                                </div>
                            </div>
                        )}
                    </PromiseHandler.Response>
                    <PromiseHandler.Error>
                        {err => (
                            <div className="md:flex justify-between">
                                <div className="md:max-w-[80%]">
                                    <Typography color="red">检查更新失败: {err?.message ?? err}</Typography>
                                </div>
                                <div className="flex flex-col md:flex-row">
                                    <Button color="red" size="md" variant="outlined" onClick={refresh}>重试</Button>
                                </div>
                            </div>
                        )}
                    </PromiseHandler.Error>
                </PromiseHandler>
            </div>
        </Fragment>
    )
}

export default VersionSettings
