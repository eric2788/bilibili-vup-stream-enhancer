import * as jimaku from './jimaku'
import * as superchat from './superchat'

import type { StreamInfo } from '~api/bilibili'
import type { Settings } from '~settings'

export type FeatureHookRender = (settings: Readonly<Settings>, info: StreamInfo) => Promise<(React.ReactPortal | React.ReactNode)[] | undefined>

export type FeatureAppRender = React.FC<{ settings: Readonly<Settings>, info: StreamInfo }>

export type FeatureType = keyof typeof features

export interface FeatureHandler {
    default: FeatureHookRender,
    App?: FeatureAppRender
}

const features = {
    jimaku, 
    superchat
}


export default (features as Record<FeatureType, FeatureHandler>)