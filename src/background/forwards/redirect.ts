import { type ForwardInfo, useDefaultHandler } from '~background/forwards'

export type ForwardBody = ForwardInfo<any> & { queryInfo?: Partial<chrome.tabs.QueryInfo> }

export default useDefaultHandler<ForwardBody>()