


export type UpdateChecker = (version: string) => Promise<chrome.runtime.RequestUpdateCheckResult>

export type UpdateAction = () => Promise<void>