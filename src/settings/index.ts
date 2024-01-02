import type { StateProxy } from '~hooks/binding';
import * as button from './fragments/button';
import * as capture from './fragments/capture'
import * as danmaku from './fragments/danmaku'
import * as developer from './fragments/developer'
import * as display from './fragments/display'
import * as jimaku from './fragments/jimaku'
import * as listings from './fragments/listings'


export type SettingFragment<T extends object> = {
    defaultSettings: Readonly<T>
    default: React.FC<StateProxy<T>>
    title: string
}

export interface SettingFragments {
    'button': SettingFragment<button.SettingSchema>
    'capture': SettingFragment<capture.SettingSchema>
    'danmaku': SettingFragment<danmaku.SettingSchema>
    'developer': SettingFragment<developer.SettingSchema>
    'display': SettingFragment<display.SettingSchema>
    'jimaku': SettingFragment<jimaku.SettingSchema>
    'listings': SettingFragment<listings.SettingSchema>
}


export type Schema<T> = T extends SettingFragment<infer U> ? U : never;

// also defined the order of the settings
const fragments: SettingFragments = {
    'danmaku': danmaku,
    'jimaku': jimaku,
    'button': button,
    'listings': listings,
    'capture': capture,
    'display': display,
    'developer': developer
}


export default fragments

