import type { Frame, Page } from "@playwright/test";

export type PageFrame = Page | Frame

export function isClosed(page: PageFrame): boolean {
    return ('isClosed' in page && page.isClosed()) || ('isDetached' in page && page.isDetached())
}

export function isPage(page: PageFrame): page is Page {
    return 'isClosed' in page
}

export function isFrame(page: PageFrame): page is Frame {
    return 'isDetached' in page
}