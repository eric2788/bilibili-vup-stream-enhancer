import type { Frame, Page } from "@playwright/test";

export type PageFrame = Page | Frame

/**
 * Checks if a page frame is closed or detached.
 * @param page - The page frame to check.
 * @returns A boolean indicating whether the page is closed or detached.
 */
export function isClosed(page: PageFrame): boolean {
    return ('isClosed' in page && page.isClosed()) || ('isDetached' in page && page.isDetached())
}

/**
 * Checks if the given object is an instance of `PageFrame`.
 * @param page - The object to be checked.
 * @returns `true` if the object is an instance of `Page`, `false` otherwise.
 */
export function isPage(page: PageFrame): page is Page {
    return 'isClosed' in page
}

/**
 * Checks if the given page is a frame.
 * @param page - The page to check.
 * @returns True if the page is a frame, false otherwise.
 */
export function isFrame(page: PageFrame): page is Frame {
    return 'isDetached' in page
}