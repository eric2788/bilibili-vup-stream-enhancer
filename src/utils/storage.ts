import { Storage } from "@plasmohq/storage"

export const storage = new Storage()
export const localStorage = new Storage({area: 'local'})



export default storage