import { webRequest } from "./utils/messaging";

// this api request is too slow
export async function getVupDetail(uid){
    return await webRequest(`https://api.vtbs.moe/v1/detail/${uid}`, 5000);
}

export async function listAllVupUids(){
    const req =  await webRequest('https://vdb.vtbs.moe/json/list.json', 5000)
    return req.vtbs.filter(v => v.type === 'vtuber').map(v => {
        const acc = v.accounts.find(acc => acc.platform == 'bilibili')
        return acc ? {
            id: acc.id,
            name: v.name[v.name.default],
            locale: v.name.default
        } : undefined
    }).filter(v => !!v)
}

export async function identifyVup(uid) {
    return (await listAllVupUids()).find(v => v.id == uid)
}