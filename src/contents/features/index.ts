import * as jimaku from './jimaku';
import * as superchat from './superchat';


export interface Features {
    'jimaku': {},
    'superchat': {}
}


export type FeatureType = keyof Features;