
import { sleep } from "~utils/misc"

const say = console.info

let random: number = undefined

function hook() {
    if (random) {
        say('please wait for other random finish')
        return
    }
    say('hooked!!!')
    random = Math.random()
}


function unhook() {
    if (!random) {
        say('please wait for other random finish')
        return
    }
    say('unhooked, random: ', random)
    random = undefined
}

async function testOnly() {
    hook()
    await sleep(3000)
    unhook()
}

export default testOnly