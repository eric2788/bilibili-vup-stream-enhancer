declare global {
    interface WebSocket {
        onInterceptMessage: (msg: MessageEvent, realOnMessage: (msg: MessageEvent) => void) => void
        _send: (data: any) => void
    }
}

function boostWebSocketHook() {

    // prevent duplicate injection
    if (WebSocket.prototype._send) return

    // this change added a fast hook for websocket onmessage, but will not change the original onmessage functionality
    WebSocket.prototype.onInterceptMessage = function (msg, realOnMessage) {
        realOnMessage(msg)
    }

    WebSocket.prototype._send = WebSocket.prototype.send
    WebSocket.prototype.send = function (data) {
        this._send(data);
        const onmsg = this.onmessage
        if (onmsg instanceof Function) {
            this.onmessage = function (event: MessageEvent) {
                this.onInterceptMessage(event, onmsg)
            }
            console.log('websocket injected.')
        } else {
            console.warn('cannot hook websocket, onmessage is not a function.')
        }
        this.send = this._send
    }
    
}

export default boostWebSocketHook