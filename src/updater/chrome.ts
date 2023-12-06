import { type UpdateChecker, type UpdateAction } from "./index.d"

export const checkUpdate: UpdateChecker = () => chrome.runtime.requestUpdateCheck()
export const update: UpdateAction = async () => chrome.runtime.reload()