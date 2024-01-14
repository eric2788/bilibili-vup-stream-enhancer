import * as chromeUpdater from './chrome'

export type UpdateChecker = (version: string) => Promise<chrome.runtime.RequestUpdateCheckResult>
export type UpdateAction = () => Promise<void>

const updaters: {
    [key: string]: {
        checkUpdate: UpdateChecker,
        update: UpdateAction
    }
} = {
    'chrome': chromeUpdater
}


export default updaters