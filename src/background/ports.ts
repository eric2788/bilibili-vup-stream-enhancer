// follow from ./ports/*.ts
import type { PlasmoMessaging } from "@plasmohq/messaging"


export type PortingData = typeof ports

interface PortData<T extends object, R = any> {
    default: PlasmoMessaging.PortHandler<T, R>
}

export type Payload<T> = T extends PortData<infer U> ? U : never

export type Response<T> = T extends PortData<any, infer U> ? U : void

const ports = {
}