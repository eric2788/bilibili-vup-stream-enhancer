
import { md5 } from 'hash-wasm'
import { injectFuncAsListener } from './utils/event'

let hash = null

async function hook() {
    say('hooked from test.js!')
    hash = await md5(`${Math.random()}`)
    say('hooked hash: ', hash)
}

async function unhook() {
    say('unhooked from test.js!')
    if (!hash) {
        say('hash not found')
        return
    }
    say('unhooked hash: ', hash)
    hash = null
}


function say(msg, ...args) {
    console.info(msg, ...args)
}


injectFuncAsListener(hook)
injectFuncAsListener(unhook)
