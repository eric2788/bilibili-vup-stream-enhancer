
import * as jimaku from './jimaku'
import * as superchat from './superchat'
import * as recorder from './recorder'

import type { FeatureType } from '~features'
import type { TableType } from "~database"
import type { StateProxy } from "~hooks/binding"

export type FeatureSettingsDefinition = {
    offlineTable: TableType | false
}

export type FeatureSettingSchema<T> = T extends FeatureFragment<infer U> ? U : never

export interface FeatureFragment<T extends object> {
    title: string
    define: FeatureSettingsDefinition
    default?: React.FC<StateProxy<T>>,
    defaultSettings: Readonly<T>
}

export type FeatureSettings = typeof featureSettings

const featureSettings = {
    jimaku,
    superchat,
    recorder
}

export default (featureSettings as { [K in FeatureType]: FeatureSettings[K] })

export const featureTypes: FeatureType[] = Object.keys(featureSettings) as FeatureType[]