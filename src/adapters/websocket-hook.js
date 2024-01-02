// @名称  bliveproxy
// @版本  0.4
// @描述  B站直播websocket hook框架
// @作者  xfgryujk
// @来源  https://ngabbs.com/read.php?tid=24449759

import { addWindowMessageListener, sendBLiveMessage, sendWindowMessage } from "~utils/messaging"
import brotliPromise from 'brotli-dec-wasm'
import { injectFuncAsListener } from "~utils/event"

// 其修改和使用已经经过 xfgryujk 本人的授权

const HEADER_SIZE = 16

const WS_BODY_PROTOCOL_VERSION_NORMAL = 0
const WS_BODY_PROTOCOL_VERSION_HEARTBEAT = 1
const WS_BODY_PROTOCOL_VERSION_BROTLI = 3

const OP_HEARTBEAT_REPLY = 3 // WS_OP_HEARTBEAT_REPLY
const OP_SEND_MSG_REPLY = 5 // WS_OP_MESSAGE
const OP_AUTH_REPLY = 8 // WS_OP_CONNECT_SUCCESS

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

let brotli = null
let onmsg = null


function myOnMessage(event, realOnMessage) {
  if (!(event.data instanceof ArrayBuffer)) {
    realOnMessage(event)
    return
  }
  let data = new Uint8Array(event.data)
  function callRealOnMessageByPacket(packet) {
    realOnMessage({ ...event, data: packet })
  }
  handleMessage(data, callRealOnMessageByPacket)
    .catch(e => {
      console.warn(`error encountered. use back old packet: ${e.message}`)
      console.warn(e)
      realOnMessage(event)
    })
}

function makePacketFromCommand(command) {
  let body = textEncoder.encode(JSON.stringify(command))
  return makePacketFromUint8Array(body, OP_SEND_MSG_REPLY)
}

function makePacketFromUint8Array(body, operation) {
  let packLen = HEADER_SIZE + body.byteLength
  let packet = new ArrayBuffer(packLen)
  // 不需要DEFLATE
  let ver = operation === OP_HEARTBEAT_REPLY ? WS_BODY_PROTOCOL_VERSION_HEARTBEAT : WS_BODY_PROTOCOL_VERSION_NORMAL
  let packetView = new DataView(packet)
  packetView.setUint32(0, packLen)        // pack_len
  packetView.setUint16(4, HEADER_SIZE)    // raw_header_size
  packetView.setUint16(6, ver)            // ver
  packetView.setUint32(8, operation)      // operation
  packetView.setUint32(12, 1)             // seq_id

  let packetBody = new Uint8Array(packet, HEADER_SIZE, body.byteLength)
  for (let i = 0; i < body.byteLength; i++) {
    packetBody[i] = body[i]
  }
  return packet
}

async function handleMessage(data, callRealOnMessageByPacket) {
  let dataView = new DataView(data.buffer)
  let operation = dataView.getUint32(8)

  switch (operation) {
    case OP_AUTH_REPLY:
    case OP_SEND_MSG_REPLY: {
      // 可能有多个包一起发，需要分包
      let offset = 0
      while (offset < data.byteLength) {
        let dataView = new DataView(data.buffer, offset)
        let packLen = dataView.getUint32(0)
        let rawHeaderSize = dataView.getUint16(4)
        let ver = dataView.getUint16(6)
        let operation = dataView.getUint32(8)
        // let seqId = dataView.getUint32(12)

        let body = new Uint8Array(data.buffer, offset + rawHeaderSize, packLen - rawHeaderSize)
        if (operation === OP_SEND_MSG_REPLY) {
          // 业务消息
          switch (ver) {
            case WS_BODY_PROTOCOL_VERSION_NORMAL: {
              // body是单个JSON消息
              body = textDecoder.decode(body)
              body = JSON.parse(body)
              await handleCommand(body, callRealOnMessageByPacket)
              break
            }
            case WS_BODY_PROTOCOL_VERSION_BROTLI: {
              // body是压缩过的多个消息
              body = brotli.decompress(body)
              await handleMessage(body, callRealOnMessageByPacket)
              break
            }
            default: {
              // 未知的body格式
              let packet = makePacketFromUint8Array(body, operation)
              callRealOnMessageByPacket(packet)
              break
            }
          }
        } else {
          // 非业务消息
          let packet = makePacketFromUint8Array(body, operation)
          callRealOnMessageByPacket(packet)
        }

        offset += packLen
      }
      break
    }

    // 服务器心跳包，前4字节是人气值，后面是客户端发的心跳包内容
    // packLen不包括客户端发的心跳包内容，不知道是不是服务器BUG
    // 这里没用到心跳包就不处理了
    // case OP_HEARTBEAT_REPLY:
    default: {
      // 只有一个包
      let packLen = dataView.getUint32(0)
      let rawHeaderSize = dataView.getUint16(4)

      let body = new Uint8Array(data.buffer, rawHeaderSize, packLen - rawHeaderSize)
      let packet = makePacketFromUint8Array(body, operation)
      callRealOnMessageByPacket(packet)
      break
    }
  }
}

async function handleCommand(command, callRealOnMessageByPacket) {
  if (command instanceof Array) {
    for (let oneCommand of command) {
      await handleCommand(oneCommand, callRealOnMessageByPacket)
    }
    return
  }

  let cmd = command.cmd || ''
  let pos = cmd.indexOf(':')
  if (pos != -1) {
    cmd = cmd.substr(0, pos)
  }

  let editedCommand = command

  try {
    editedCommand = await sendBLiveMessage({ cmd, command })
  } catch (err) {
    console.warn(err)
  }

  let packet = makePacketFromCommand(editedCommand)
  callRealOnMessageByPacket(packet)
}

//修改掛接方式，將不再採用Proxy
async function hook() {
  // singleton
  if (brotli === null) {
    brotli = await brotliPromise
  }

  if (onmsg !== null) {
    console.warn('cannot hook websocket, please unhook first.')
    return
  }

  console.log('injecting websocket..')
  return new Promise((res, rej) => {
    WebSocket.prototype._send = WebSocket.prototype.send
    WebSocket.prototype.send = function (data) {
      this._send(data);
      onmsg = this.onmessage
      if (onmsg instanceof Function) {
        this.onmessage = function (msg) {
          myOnMessage(msg, onmsg)
        }
        console.log('websocket injected.')
        res()
      } else {
        rej('cannot hook websocket, onmessage is not a function.')
      }
      this.send = this._send
    }
  })
}

async function unhook() {
  if (onmsg === null) {
    console.warn('websocket not hooked.')
    return
  }
  console.log('unhooking websocket..')
  return new Promise((res,) => {
    WebSocket.prototype._send = WebSocket.prototype.send
    WebSocket.prototype.send = function (data) {
      this._send(data);
      this.onmessage = onmsg.bind(this)
      this.send = this._send
      onmsg = null
      console.log('websocket unhooked.')
      res()
    }
  })
}


injectFuncAsListener(hook)
injectFuncAsListener(unhook)