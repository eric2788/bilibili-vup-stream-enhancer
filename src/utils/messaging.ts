import { sendToBackground } from "@plasmohq/messaging"
import { getPort } from "@plasmohq/messaging/port"
import { type MessagingData, type Payload, type Response } from "~background/messages"
import { type PortingData } from "~background/ports"

export async function sendBackground<T extends keyof MessagingData>(name: T, body: Payload<MessagingData[T]> = undefined): Promise<Response<MessagingData[T]> | void> {
    return sendToBackground({ name, body }).then(res => res as Response<MessagingData[T]>)
}

export async function sendPort<T extends keyof PortingData>(name: T, body: PortingData[T]) {
    return getPort(name).postMessage({ body })
}