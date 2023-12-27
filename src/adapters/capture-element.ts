import type { Settings } from "~settings";





// function chatMonitor(settings: Settings) {
//     const { attr: attribute, elements } = settings.developer
//     const callback = function (mutationsList) {
//         for (const mu of mutationsList) {
//             for (const node of mu.addedNodes) {
//                 const danmaku = $(node)?.attr(attribute.chatDanmaku)?.trim()
//                 const userId = $(node)?.attr(attribute.chatUserId)?.trim()
//                 const isTongChuan = settings.tongchuanMans.includes(`${userId}`)
//                 // 在同传黑名单内
//                 if (settings.tongchuanBlackList.includes(`${userId}`)) {
//                     console.log(`用户 ${userId} 在同传黑名单内, 已略过。`)
//                     continue
//                 }
//                 if (danmaku) {
//                     const id = `${danmaku}-${userId}`
//                     if (beforeInsert.pop() === id) continue
//                     console.debug(`[BJF] ${danmaku}`)
//                     beforeInsert.push(id)
//                 }
//                 let subtitle = toJimaku(danmaku, settings.regex)
//                 if (!subtitle && isTongChuan) subtitle = danmaku
//                 if (subtitle !== undefined) {
//                     if (beforeInsert.shift() === subtitle) {
//                         continue
//                     }
//                     pushSubtitle(subtitle, userId)
//                 }
//             }
//         }
//     }
//     const observer = new Observer((mlist,) => callback(mlist));
//     observer.observe($(elements.chatItems)[0], config);
//     observers.push(observer)
// }













export function startHook(settings: Settings) {
    console.info('capture element!')
}


export function disposeHook(){
    console.info('dispose capture element!')
}