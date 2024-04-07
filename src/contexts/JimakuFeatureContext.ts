import { createContext } from "react";
import { type  FeatureSettingSchema as FeatureJimakuSchema } from "~options/features/jimaku";

const JimakuFeatureContext = createContext<FeatureJimakuSchema>(null)

export default JimakuFeatureContext