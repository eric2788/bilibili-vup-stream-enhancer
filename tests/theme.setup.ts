import { extensionBase as setup } from "./fixtures/base";
import logger from "./helpers/logger";
import { Strategy } from "./utils/misc";

setup('預先搜索大海報房間', async ({ cacher, rooms, maxRoomRetries, roomId }) => {
    setup.skip(roomId > 0, '已指定直播房間，跳過搜索')
    setup.skip(rooms.length < 2, '房間數量不足，跳過搜索')
    console.info('正在搜索大海報房間...')
    if (!process.env.CI) {
        const info = cacher.findRoomTypeFromCache('theme')
        setup.skip(!!info, '已從緩存中找到大海報房間: ' + info?.roomid)
    }
    logger.info('rooms: ', rooms.map(r => r.roomid))
    const generator = Strategy.random(rooms, Math.min(maxRoomRetries, rooms.length))
    const info = await cacher.findRoomType('theme', generator)
    if (!info) {
        console.warn(`找不到大海報的房間`)
    } else {
        console.info(`成功找到大海報房間: ${info.roomid}`)
    }
    await cacher.writeToFileCache('theme', info)
    console.info(`已將大海報房間 ${info?.roomid ?? '無'} 寫入緩存`)
})