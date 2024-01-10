import { createContext } from "react";
import type { FeatureSettingSchema as SuperChatFeatureSchema } from "~settings/features/superchat";

const SuperChatFeatureContext = createContext<SuperChatFeatureSchema>(null)

export default SuperChatFeatureContext