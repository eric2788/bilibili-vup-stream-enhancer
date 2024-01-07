
import { type ForwardHandler } from "../forwards"


export type ResponseBody = {
    uname: string
    text: string
    color: string
    pos: 'ltr' | 'rtl' | 'top' | 'bottom'
}


export type ForwardBody = {
    uname: string
    text: string
    color: number
    position: number
}

const handler: ForwardHandler<ForwardBody, ResponseBody> = (req) => {

    let pos: 'ltr' | 'rtl' | 'top' | 'bottom' = 'rtl'
    switch (req.body.position) {
        case 5:
            pos = 'top'
            break
        case 4:
            pos = 'bottom'
            break
    }

    return {
        ...req,
        body: {
            uname: req.body.uname,
            text: req.body.text,
            color: req.body.color.toString(16),
            pos,
        }
    }
}

export default handler