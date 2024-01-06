
async function boostWebSocketHook(): Promise<void> {
    // prevent duplicate injection
    if (WebSocket.prototype._send) return
    return new Promise((res, rej) => {
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
                console.log('websocket hook boosted.')
            } else {
                console.warn('cannot boost websocket hook, onmessage is not a function.')
                rej('cannot boost websocket hook, onmessage is not a function.')
            }
            this.send = this._send
            res()
        }
    })
}

export default boostWebSocketHook