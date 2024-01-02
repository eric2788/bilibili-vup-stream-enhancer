import { getForwarder, sendForward, useDefaultHandler, type ForwardInfo } from "~background/forwards";

export type ForwardBody = ForwardInfo<any> & { queryInfo?: Partial<chrome.tabs.QueryInfo> }

export default useDefaultHandler<ForwardBody>()

getForwarder('redirect', 'background').addHandler(data => {
    console.info('received redirect: ', data)
    sendForward(data.target, data.command, data.body, data.queryInfo ?? { active: true })
})