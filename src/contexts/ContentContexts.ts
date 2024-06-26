import { createContext } from "react";
import type { StreamInfo } from "~api/bilibili";
import type { Settings } from "~options/fragments";

export type ContentContextProps = {
    info: StreamInfo
    settings: Settings
}

const ContentContext = createContext<ContentContextProps>(null)

export default ContentContext