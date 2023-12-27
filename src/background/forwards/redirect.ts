import { getForwarder, sendForward, useDefaultHandler, type ForwardInfo } from "~background/forwards";

export type ForwardBody = ForwardInfo<any> & { queryInfo?: Partial<chrome.tabs.QueryInfo> }

export default useDefaultHandler<ForwardBody>()