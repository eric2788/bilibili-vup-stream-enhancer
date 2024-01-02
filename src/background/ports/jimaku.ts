import type { PlasmoMessaging } from "@plasmohq/messaging";



export type RequestBody = string | {
    room: string
    data: string
    text: string
}


const handler: PlasmoMessaging.PortHandler<string> = async (req, res) => {

    console.info('[jimaku] received: ', req.body)

    res.send({
        message: "Hello from port handler"
    })
}

export default handler