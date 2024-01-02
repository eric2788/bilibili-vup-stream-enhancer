import { md5 } from "hash-wasm";
import type { ForwardHandler } from "../forwards";

export type ForwardBody = {
    room: string
    text: string
    date: string
}


export type ForwardResponse = ForwardBody & {
    hash: string
}


// this handler is just for adding hash to the body
const handler: ForwardHandler<ForwardBody, ForwardResponse> = async (req) => {
    const hash = await md5(JSON.stringify(req.body))
    return {
        ...req,
        body: {
            ...req.body,
            hash
        }
    }
}

export default handler