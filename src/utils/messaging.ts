import { sendToBackground, type MessagesMetadata, sendToContentScript } from "@plasmohq/messaging"
import { getPort } from "@plasmohq/messaging/port"
import { type MessagingData } from "~background/messages"
import { type PortingData } from "~background/ports"

export async function sendBackground<T extends keyof MessagingData>(name: T, body: MessagingData[T] = undefined) {
    return sendToBackground({ name, body })
}

export async function sendPort<T extends keyof PortingData>(name: T, body: PortingData[T]) {
    return getPort(name).postMessage(body)
}