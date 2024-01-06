import type { BLiveDataWild } from "~types/bilibili"
import { useDefaultHandler } from "~background/forwards"

export type ForwardBody<K extends string> = {
    cmd: K
    command: BLiveDataWild<K>
}

export default useDefaultHandler<ForwardBody<any>>()