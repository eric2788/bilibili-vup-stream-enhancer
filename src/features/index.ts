import type { StreamInfo } from '~api/bilibili';
import * as jimaku from './jimaku';
import * as superchat from './superchat';
import type { Settings } from '~settings';

export type FeatureHookRender = (settings: Readonly<Settings>, info: StreamInfo) => Promise<React.ReactPortal[]>

export type FeatureAppRender = (settings: Readonly<Settings>, info: StreamInfo) => Promise<React.ReactNode>

export type FeatureType = keyof typeof features

export interface FeatureHandler {
    default: FeatureHookRender,
    App?: FeatureAppRender
}

const features = {
    'jimaku': jimaku,
    'superchat': superchat
}


export default (features as Record<FeatureType, FeatureHandler>)