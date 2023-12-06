import { sendToBackground, type MessagesMetadata } from "@plasmohq/messaging"
import { type MessagingData } from "~background/messages"

export async function sendBackground<T extends keyof MessagesMetadata>(name: T, body: MessagingData[T]) {
    return sendToBackground({name, body})
}