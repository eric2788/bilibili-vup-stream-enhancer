const urlParams = new URLSearchParams(window.location.search);
const roomId = parseInt(urlParams.get('roomId'));
const title = urlParams.get('title')

if (!roomId){
    alert('未知房间Id, 此同传弹幕视窗不会运行。')
    throw new Error('未知房间Id, 此同传弹幕视窗不会运行。')
}

document.title = `B站直播间 ${roomId} 的同传弹幕视窗`
$('#title')[0].innerText = title !== 'null' ? title : `B站直播间 ${roomId} 的同传弹幕视窗`

const keepBottom = () => $('#keep-bottom').prop('checked')

// eslint-disable-next-line no-undef
const inst = new mdui.Menu('#more-btn', '#menu');

$('#more-btn').on('click', () => inst.open())

browser.runtime.onMessage.addListener((message) => {
    if (message.type !== 'jimaku') return
    const { room, date, text } = message.data
    if (!room || !date || !text) {
        console.warn('所接收的數據不完整，已略過')
    }
    if (room !== roomId) return
    const id = `jimaku-${Date.now()}`
    const line = `【${date}】 ${text}`
    $('#jimaku-list').append(`
        <li id="${id}" class="mdui-list-item">${line}</li>
    `)
    if (keepBottom()) $('html, body').scrollTop($(document).height())
})


