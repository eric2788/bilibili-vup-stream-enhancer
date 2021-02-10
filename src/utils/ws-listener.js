
const commandHandler = {}

function addHandler(cmd, handle) {
    if (isAsync(handle)) throw new Error('不能添加 async function 到監聽器')
    if (!commandHandler[cmd]){
        commandHandler[cmd] = []
    }
    const handlers = commandHandler[cmd]
    handlers.push(handle)
}

function handleCommand(cmd, command){
    const handlers = commandHandler[cmd] || []
    for (const handle of handlers){
        handle(command)
    }
}

function clearHandlers(cmd){
    commandHandler[cmd] = []
}

let launched = false

function launchListeners(){
    if (launched) return
    window.addEventListener('ws:bilibili-live', ({detail: {cmd, command, eventId}}) => {
        try {
            handleCommand(cmd, command)
        }catch(err){
            console.warn(`執行 ${cmd} 事件時發生錯誤: ${err.message}`)
            console.error(err)
        }finally{
            callback(command, eventId)
        }
    })
    launched = true
}

function callback(command, eventId){
    const event = new CustomEvent(`ws:callback:${eventId}`, {detail: command})
    window.dispatchEvent(event)
}

const isAsync = (func) => func.constructor.name === "AsyncFunction"

export default {
    addHandler,
    clearHandlers,
    launchListeners
}