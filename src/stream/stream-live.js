import { runtime, windows } from "webextension-polyfill"

console.log('stream live is working.')

/* only need to use when using get-stream-url
webRequest.onBeforeSendHeaders.addListener((details) => {
    console.log(`added origin header for video: ${details.url}`)
    details.requestHeaders.push({ 'origin': 'https://live.bilibili.com' })
    console.log(details.requestHeaders)
}, {
    urls: ['https://*.bilivideo.com/*'],
});
*/

runtime.onMessage.addListener((message) => {
    switch(message.type){
        case "fetch-stream": {
            const {url, callback} = message
            return fetchStream(url, callback)
        }
        case "get-stream-url": {
            const roomid = message.roomId
            return getRoomPlayUrl(roomid).then(findSuitableURL)
        }
        case "get-stream-urls": {
            const roomid = message.roomId
            return getRoomPlayUrl(roomid)
        }
        case "stream-window": {
            return openStreamWindow(message.roomId, message.title)
        }
    }
})


async function openStreamWindow(roomId, title) {
    return windows.create({
        url: runtime.getURL(`stream.html?roomId=${roomId}&title=${title}`),
        type: 'detached_panel',
        width: 1189,
        height: 720,
    })
}




async function fetchStream(url, callback) {
    const res = await fetch(url)
    const reader = res.body.getReader()
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read()
        if (!done) return
        await callback(value)
    }
}

async function fetcher(url) {
    const res = await fetch(url, { credentials: 'same-origin' })
    if (!res.ok){
        throw new Error(res.statusText)
    }
    const data = await res.json()
    if (data.code != 0){
        throw new Error(`B站API请求错误: ${data.message}`)
    }
    return data
}

async function testUrlValid(url){
    const res = await fetch(url)
    if (!res.ok){
       throw new Error(res.statusText)
    }
}

async function findSuitableURL(stream_urls){
    for (const stream_url of stream_urls){
         try {
            await testUrlValid(stream_url)
            console.log(`找到可用线路: ${stream_url}`)
            return stream_url
         }catch(err){
           console.warn(`测试线路 ${stream_url} 时出现错误: ${err}, 寻找下一个节点`)
         }
     }
    return undefined
 }
 

async function getRoomPlayUrl(roomid, qn = 10000){
    const stream_urls = []
    const url = `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,2&codec=0,1&qn=${qn}&platform=web&ptype=16`
   const res = await fetcher(url)

   if (res.data.is_hidden){
       console.warn('此直播間被隱藏')
       return stream_urls
   }

    if (res.data.is_locked){
        console.warn('此直播間已被封鎖')
        return stream_urls
    }

    if (res.data.encrypted && !res.data.pwd_verified){
        console.warn('此直播間已被上鎖')
        return stream_urls
    }

    const streams = res?.data?.playurl_info?.playurl?.stream ?? []
    if (streams.length == 0){
        console.warn('没有可用的直播视频流')
        return stream_urls
    }

    for (const index in streams){
        const st = streams[index]

        for (const f_index in st.format){
            const format = st.format[f_index]
            if (format.format_name !== 'flv'){
                console.warn(`线路 ${index} 格式 ${f_index} 并不是 flv, 已经略过`)
                continue
            }

            for (const c_index in format.codec){
                const codec = format.codec[c_index]
                 if (codec.current_qn != qn){
                     console.warn(`线路 ${index} 格式 ${f_index} 编码 ${c_index} 的画质并不是 ${qn}, 已略过`)
                     continue
                 }
                 const accept_qn = codec.accept_qn
                 if (!accept_qn.includes(qn)){
                     console.warn(`线路 ${index} 格式 ${f_index} 编码 ${c_index} 不支援画质 ${qn}, 已略过`)
                     continue
                 }
                 const base_url = codec.base_url
                 for (const url_info of codec.url_info){
                     const real_url = url_info.host + base_url + url_info.extra
                     stream_urls.push(real_url)
                 }
            }

            return stream_urls
        }


    }
}