import { createContext } from "react";
import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~settings";

export type StreamInfoContextProps = {
    info: StreamInfo
    settings: Settings
}

const StreamInfoContext = createContext<StreamInfoContextProps>(null)

export default StreamInfoContext