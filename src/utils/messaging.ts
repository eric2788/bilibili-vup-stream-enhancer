import { sendToBackground } from "@plasmohq/messaging";

async function sendData(name: string, body: any){
    return sendToBackground({name, body});
}

async function sendRequest(url: string, timer = 15000) {
    return sendData("request", { url, timer });
}

