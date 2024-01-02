import { sendToBackground, type PlasmoMessaging, type MessagesMetadata } from "@plasmohq/messaging";

async function sendData(name: keyof MessagesMetadata, body: any){
    return sendToBackground({name, body});
}

export async function sendRequest(url: string, timer = 15000) {
    return sendData("request", { url, timer });
}

export async function sendNotify(body: {title: string, message: string | string[]}) {
    return sendData("notify", body);
}

export async function checkUpdate() {
    return sendData("check-update", {});
}