import { createContext } from "react";
import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~settings";

export type SteamInfoContextProps = {
    info: StreamInfo
    settings: Settings
}

const StreamInfoContext = createContext<SteamInfoContextProps>(null)

export default StreamInfoContext