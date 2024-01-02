import type { StateProxy } from '~hooks/binding';
import * as button from './fragments/button';
import * as capture from './fragments/capture'
import * as danmaku from './fragments/danmaku'
import * as developer from './fragments/developer'
import * as display from './fragments/display'
import * as jimaku from './fragments/jimaku'
import * as listings from './fragments/listings'
import * as features from './fragments/features'


interface SettingFragment<T extends object> {
    defaultSettings: Readonly<T>
    default: React.FC<StateProxy<T>>
    title: string
}

export type SettingFragments = typeof fragments

export type Schema<T> = T extends SettingFragment<infer U> ? U : never;

export type Settings = {
    [K in keyof SettingFragments]: Schema<SettingFragments[K]>
}

// also defined the order of the settings
const fragments = {
    'settings.danmaku': danmaku,
    'settings.jimaku': jimaku,
    'settings.button': button,
    'settings.listings': listings,
    'settings.features': features,
    'settings.capture': capture,
    'settings.display': display,
    'settings.developer': developer
}


export default fragments

