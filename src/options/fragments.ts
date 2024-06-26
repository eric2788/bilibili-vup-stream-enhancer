import type { StateProxy } from '~hooks/binding'
import * as capture from './fragments/capture'
import * as developer from './fragments/developer'
import * as display from './fragments/display'
import * as features from './fragments/features'
import * as listings from './fragments/listings'
import * as version from './fragments/version'

import type { StreamInfo } from '~api/bilibili'


type ShouldInit<T extends object> = (settings: Readonly<T>, info: StreamInfo) => Promise<boolean>

interface SettingFragment<T extends object> {
    defaultSettings: Readonly<T>
    default: React.FC<StateProxy<T>>
    title: string
    description: string | string[]
}

export type SettingFragments = typeof fragments

export type Schema<T> = T extends SettingFragment<infer U> ? U : never

export type Settings = {
    [K in keyof SettingFragments]: Schema<SettingFragments[K]>
}


export async function shouldInit(settings: Settings, info: StreamInfo): Promise<boolean> {
    const shouldInits = Object.entries(fragments).map(([key, fragment]) => {
        const shouldInit = (fragment as any).shouldInit as ShouldInit<Schema<typeof fragment>>
        if (shouldInit) {
            return shouldInit(settings[key], info)
        }
        return Promise.resolve(true)
    })
    return (await Promise.all(shouldInits)).every(Boolean)
}

// also defined the order of the settings
const fragments = {
    'settings.features': features,
    'settings.listings': listings,
    'settings.capture': capture,
    'settings.display': display,
    'settings.developer': developer,
    'settings.version': version
}


export default fragments

