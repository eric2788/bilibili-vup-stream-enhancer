import type { StateProxy } from '~hooks/binding'
import * as capture from './fragments/capture'
import * as developer from './fragments/developer'
import * as display from './fragments/display'
import * as features from './fragments/features'
import * as listings from './fragments/listings'
import * as version from './fragments/version'
import * as llm from './fragments/llm'


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

// also defined the order of the settings
const fragments = {
    'settings.features': features,
    'settings.listings': listings,
    'settings.capture': capture,
    'settings.display': display,
    'settings.llm': llm,
    'settings.developer': developer,
    'settings.version': version
}

export default fragments

