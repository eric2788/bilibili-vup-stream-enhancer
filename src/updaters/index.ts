import * as chromeUpdater from './chrome';
import * as firefoxUpdater from './firefox';

export type UpdateChecker = (version: string) => Promise<chrome.runtime.RequestUpdateCheckResult>
export type UpdateAction = () => Promise<void>

const updaters: {
    [key: string]: {
        checkUpdate: UpdateChecker,
        update: UpdateAction
    }
} = {
    'firefox': firefoxUpdater,
    'chrome': chromeUpdater
}


export default updaters