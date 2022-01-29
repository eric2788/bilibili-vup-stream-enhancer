import { runtime } from "webextension-polyfill";
import { getStreamUrls } from "../utils/messaging";
import flvjs from "./flv";

const urlParams = new URLSearchParams(window.location.search);
const roomId = parseInt(urlParams.get('roomId'));
const title = urlParams.get('title')

if (!roomId) {
    alert('未知房间Id, 视窗打开失败。')
    throw new Error('未知房间Id, 视窗打开失败。')
}

document.title = `${title} (${roomId})`

const vid = $('#live')[0]
const track = vid.addTextTrack('captions', '同传字幕', 'zh-CN')
track.addEventListener('error', console.error)
track.mode = "showing"

function startJimakuListener() {
    runtime.onMessage.addListener((message) => {
        if (message.type !== 'jimaku') return
        const { room, date, text } = message.data
        if (!room || !date || !text) {
            console.warn('所接收的數據不完整，已略過')
            return
        }
        if (room !== roomId) return
        const start = vid.currentTime
        const end = start + 3 // 字幕逗留 3 秒
        const cue = new VTTCue(start, end, text)
        track.addCue(cue)
        // 不知为何 track 有时候会无法显示字幕，因此暂时使用
        // subtitle list 来显示字幕
        $('#list').prepend(`<li>${text}</li>`);
        console.log(`收到同传字幕: ${text} 於时间 ${start}, 将逗留 ${end - start} 秒`)

    })
    console.log(`已启动字幕监听`)
}

!(async function () {

    const urls = await getStreamUrls(roomId)
    if (urls.length == 0) {
        alert('找不到可用的直播流 URL，视窗打开失败。')
        window.close()
        return
    }

    if (flvjs.isSupported()) {
        for (const url of urls) {
            try {
                console.log('try fetching with '+url)
                await loadAndPlay(url)
                startJimakuListener()
                return;
            } catch (e) {
                console.error(`线路 ${url} 无法播放: ${e}`)
                console.warn('五秒后尝试下一个线路')
                await sleep(5000)
            }
        }
        // all url failed
        alert('所有线路都无法播放，视窗打开失败。')
    } else {
        alert('你的浏览器不支援 flv, 請更新浏览器。')
    }
    window.close()
})();

async function sleep(ms) {
    return new Promise((res,) => {
        setTimeout(res, ms)
    })
}

function loadAndPlay(url) {

    return new Promise((res, rej) => {
        try {
            const videoElement = document.getElementById("live");
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: url,
                isLive: true,
                autoCleanupSourceBuffer: true,
                headers: {
                    'origin': 'https://live.bilibili.com'
                }
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
            flvPlayer.on('media_info', res)
            flvPlayer.on('error', (e) => {
                flvPlayer.detachMediaElement()
                rej(e)
            })
        } catch (e) {
            rej(e)
        }
    })
}