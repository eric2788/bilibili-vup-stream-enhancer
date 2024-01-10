import { createContext } from "react";
import { type  FeatureSettingSchema as FeatureJimakuSchema } from "~settings/features/jimaku";

const JimakuFeatureContext = createContext<FeatureJimakuSchema>(null)

export default JimakuFeatureContext