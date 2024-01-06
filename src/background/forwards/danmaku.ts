import type { DirectionType } from "dplayer"
import { type ForwardHandler } from "../forwards"


export type ResponseBody = {
    uname: string
    text: string
    color: string
    type: DirectionType
}


export type ForwardBody = {
    uname: string
    text: string
    color: number
    position: number
}

const handler: ForwardHandler<ForwardBody, ResponseBody> = (req) => {

    let type: DirectionType = 'right'
    switch (req.body.position) {
        case 5:
            type = 'top'
            break
        case 4:
            type = 'bottom'
            break
    }

    return {
        ...req,
        body: {
            uname: req.body.uname,
            text: req.body.text,
            color: req.body.color.toString(16),
            type,
        }
    }
}

export default handler