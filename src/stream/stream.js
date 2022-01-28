import { runtime } from "webextension-polyfill";
import { getStreamUrl } from "../utils/messaging";
import flvjs from "./flv";

const urlParams = new URLSearchParams(window.location.search);
const roomId = parseInt(urlParams.get('roomId'));
const title = urlParams.get('title')

if (!roomId){
    alert('未知房间Id, 请重开此视窗。')
    throw new Error('未知房间Id, 请重开此视窗。')
}

document.title = `${title} (${roomId})`

const vid = $('#live')[0]
const track = vid.addTextTrack('captions', '同传字幕', 'zh')
track.mode = "showing"

function startJimakuListener(){

    runtime.onMessage.addListener((message) => {
        if (message.type !== 'jimaku') return
        const { room, date, text } = message.data
        if (!room || !date || !text) {
            console.warn('所接收的數據不完整，已略過')
            return
        }
        if (room !== roomId) return
        
        const start = vid.currentTime // buffer
        const end = start + 3 // 字幕逗留 3 秒
        const cue = new VTTCue(start, end, text)
        track.addCue(cue)
        console.log(`收到同传字幕: ${text} 於时间 ${start}, 将逗留 ${end - start} 秒`)
    })
    console.log(`已启动字幕监听`)
}

!(async function(){
    const url = await getStreamUrl(roomId)
    if (!url){
        alert('找不到可用的直播流 URL，请重开此视窗。')
        window.close()
        return
    }
    if (flvjs.isSupported()) {
        var videoElement = $('#live')[0];
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url,
            isLive: true
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        startJimakuListener();
    }else{
        alert('你的浏览器不支援 flv, 請更新浏览器。')
    }
})();