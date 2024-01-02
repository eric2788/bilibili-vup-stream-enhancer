import type { UpdateChecker, UpdateAction } from '.'

export const checkUpdate: UpdateChecker = () => chrome.runtime.requestUpdateCheck()
export const update: UpdateAction = async () => chrome.runtime.reload()