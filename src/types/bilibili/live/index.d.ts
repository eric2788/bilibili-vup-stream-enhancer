import { DanmuMsg } from './danmu_msg'
import { InteractWord } from './interact_word'
import { SuperChatMessage } from './super_chat_message'

export type BLiveData = {
    'DANMU_MSG': DanmuMsg,
    'INTERACT_WORD': InteractWord,
    'SUPER_CHAT_MESSAGE': SuperChatMessage,
}


export type BLiveType = keyof BLiveData
export type BLiveDataWild<T = string> = T extends BLiveType ? BLiveData[T] : any


export {
    DanmuMsg,
    InteractWord,
    SuperChatMessage
}
