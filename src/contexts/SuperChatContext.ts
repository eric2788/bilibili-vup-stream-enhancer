import { createContext } from "react";
import { type SuperChatCard } from "../features/superchat/components/SuperChatItem";

export type SuperChatContextType = { 
    superchats: SuperChatCard[], 
    clearSuperChat: VoidFunction 
}


const SuperChatContext = createContext<SuperChatContextType>(null)

export default SuperChatContext