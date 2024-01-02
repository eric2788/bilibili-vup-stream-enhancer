import { injectFuncAsListener } from "~utils/event"
import { sleep } from "~utils/misc"

const say = console.info

let random: number = undefined

function hook() {
    say('hooked!!!')
    random = Math.random()
}


function unhook() {
    say('unhooked, random: ', random)
    random = undefined
}


async function test() {
    hook()
    await sleep(3000)
    unhook()
}


injectFuncAsListener(test)