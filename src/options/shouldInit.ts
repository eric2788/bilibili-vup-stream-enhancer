import type { Settings } from "~options/fragments"
import { type StreamInfo, ensureIsVtuber } from "~api/bilibili"

export async function shouldInit(settings: Settings, info: StreamInfo): Promise<boolean> {
    
    const {
        "settings.features": features,
        "settings.listings": listings,
        "settings.developer": developer
    } = settings

    // features
    if (!info) {
        // do log
        console.info('無法取得直播資訊，已略過')
        return false
    }

    if (info.status === 'offline' && features.enabledRecording.length === 0 && !developer.extra.forceBoot) {
        console.info('直播為下綫狀態，且沒有啓用離綫儲存，已略過。(强制啓動為禁用)')
        return false
    }

    if (features.common.onlyVtuber) {

        if (info.uid !== '0') {
            await ensureIsVtuber(info)
        }

        if (!info.isVtuber) {
            // do log
            console.info('不是 VTuber, 已略過')
            return false
        }

    }

    // listings
    if (listings.blackListRooms.some((r) => r.room === info.room || r.room === info.shortRoom) === !listings.useAsWhiteListRooms) {
        console.info('房間已被列入黑名單，已略過')
        return false
    }

    return true;
}
