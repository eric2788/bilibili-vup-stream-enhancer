import { sendToBackground } from "@plasmohq/messaging"
import { getPort } from "@plasmohq/messaging/port"
import type { MessagingData, Payload as MsgPayload, Response as MsgResponse } from "~background/messages"
import type { PortingData, Payload as PortPayload, Response as PortResponse } from "~background/ports"

export async function sendBackground<T extends keyof MessagingData>(name: T, body: MsgPayload<MessagingData[T]> = undefined): Promise<MsgResponse<MessagingData[T]> | void> {
    return sendToBackground({ name, body }).then(res => res as MsgResponse<MessagingData[T]>)
}

export async function sendPort<T extends keyof PortingData>(name: T, body: PortPayload<PortingData[T]> = undefined): Promise<PortResponse<PortingData[T]> | void> {
    return getPort(name).postMessage({ body })
}