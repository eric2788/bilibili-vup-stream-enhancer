import { useDefaultHandler } from "~background/forwards"

export type ForwardBody = {
    roomId: string
    jimakus: string[]
}

export default useDefaultHandler<ForwardBody>()