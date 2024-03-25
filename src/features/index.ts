import * as jimaku from './jimaku'
import * as superchat from './superchat'
import * as recorder from './recorder'

import type { StreamInfo } from '~api/bilibili'
import type { Settings } from '~settings'

export type FeatureHookRender = (settings: Readonly<Settings>, info: StreamInfo) => Promise<(React.ReactPortal | React.ReactNode)[] | undefined>

export type FeatureAppRender = React.FC<{}>

export type FeatureType = keyof typeof features

export interface FeatureHandler {
    default: FeatureHookRender,
    App?: FeatureAppRender,
    FeatureContext?: React.Context<any>
}

const features = {
    jimaku, 
    superchat,
    recorder
}


export default (features as Record<FeatureType, FeatureHandler>)