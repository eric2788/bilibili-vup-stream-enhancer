import { createContext } from "react";
import type { FeatureSettingSchema as RecorderFeatureSchema } from "~options/features/recorder";

const RecorderFeatureContext = createContext<RecorderFeatureSchema>(null)

export default RecorderFeatureContext