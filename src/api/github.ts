import type { ReleaseInfo } from "~types/github";
import { fetchAndCache } from "~utils/fetch";

export async function getLatestRelease(): Promise<ReleaseInfo> {
    return await fetchAndCache<ReleaseInfo>('https://api.github.com/repos/eric2788/bilibili-vup-stream-enhancer/releases/latest')
}

export async function getRelease(tag: string): Promise<ReleaseInfo> {
    return await fetchAndCache<ReleaseInfo>(`https://api.github.com/repos/eric2788/bilibili-vup-stream-enhancer/releases/tags/${tag}`)
}