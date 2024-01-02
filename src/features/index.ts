import type { StreamInfo } from '~api/bilibili';
import type { Settings } from '~settings';
import * as jimaku from './jimaku';
import * as superchat from './superchat/superchat';

export type FeatureHookRender = (settings: Readonly<Settings>, info: StreamInfo) => Promise<React.ReactPortal[]>

export type FeatureAppRender = React.FC<{ settings: Readonly<Settings>, info: StreamInfo }>

export type FeatureType = keyof typeof features

export interface FeatureHandler {
    default: FeatureHookRender,
    App?: FeatureAppRender
    init?: () => Promise<void>
    dispose?: () => Promise<void>
}

const features = {
    'jimaku': jimaku,
    'superchat': superchat
}


export default (features as Record<FeatureType, FeatureHandler>)