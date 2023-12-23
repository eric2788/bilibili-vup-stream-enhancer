import semver from 'semver'
import { sendMessager } from '~utils/messaging'
import type { UpdateAction, UpdateChecker } from '.'

interface UpdateInfo {
    version: string
    update_link: string
    update_info_url: string
}


// it is because firefox does not support chrome.runtime.requestUpdateCheck
export const checkUpdate: UpdateChecker = async (version: string): Promise<chrome.runtime.RequestUpdateCheckResult> => {
    const { browser_specific_settings: { gecko: { id, update_url }} } = chrome.runtime.getManifest() as any
    if (!update_url) {
        console.warn('Cannot get update_url from manifest.json, it means you have published firefox store, manual check update is not supported.')
        return {
            version: version,
            status: 'no_update'
        }
    }
    const { addons } = await sendMessager('request', { url: update_url })
    if (!addons) {
        console.error('Cannot get addons from update_url')
        return {
            version: '',
            status: 'throttled'
        }
    }
    const { version: latest_version } = findLatest(addons[id].updates as UpdateInfo[])
    return {
        version: latest_version,
        status: semver.compare(version, latest_version) >= 0 ? 'no_update' : 'update_available'
    }
}


// however, firefox does support chrome.runtime.reload
export const update: UpdateAction = async () => chrome.runtime.reload()


function findLatest(infos: UpdateInfo[]): UpdateInfo {
    return infos.reduce((latest, current) => semver.compare(latest.version, current.version) > 0 ? latest : current)
}