import { sendNotify } from "./utils/messaging";
import { download, generateToken, roomId, sleep } from "./utils/misc";
import ws from './utils/ws-listener'

function creatSuperChatCard({
    bg_color,
    bg_image,
    bg_header_color,
    user_icon,
    name_color,
    uid,
    username,
    price,
    message
}){
    const msg = message.replaceAll(/<\/*script.*?>/g, "") // avoid xss attack
    return `
        <div style="
            background-color: ${bg_color};
            min-height: 70px;
            margin-bottom: 10px;
            border: 1px ${bg_color} solid;
            animation: top .5s ease-out;
            box-shadow: 1px 1px 5px black;
        ">
            <div style="background-image: url('${bg_image}'); 
                        height: 40px;
                        background-color: ${bg_header_color};
                        padding: 5px;
                        background-size: cover;
                        background-position: left center">
                    <a href="//space.bilibili.com/${uid}" target="_blank">
                        <img src="${user_icon}" height="40" width="40" style="border-radius: 20px; float: left">
                    </a>
                    <a href="//space.bilibili.com/${uid}" target="_blank" style="color: ${name_color}; font-size: 15px;padding-left: 5px;text-decoration: none">${username}</a>
                    <span style="font-size: 15px;float: right">￥${price}</span>
            </div>
            <div style="padding: 10px;overflow-wrap: break-word">
                    <span style="color: white; font-size: 14px">${msg}</span>
            </div>
        </div>
    `
}

function switchMenu(e){
    const btn = $(e.currentTarget);
    const v = !(btn.attr('show') === 'true')
    btn.attr('show', v)
    const color = v ? '#3e8e41' : 'gray'
    const display = v ? 'block' : 'none'
    $('.sc-btn-list').css('display', display)
    $('.dropdown-content-sc').css('display', display)
    $('.dropbtn-sc').css('background-color', color)
  }

export async function launchSuperChatInspect(settings, { buttonOnly, restart }){

    if (buttonOnly) return

    /*
    if (isTheme) {
        console.log('大海報房間將不支援醒目留言記錄過濾。')
        return
    }
    */

    let buttonArea = $('div.room-info-ctnr.dp-i-block').length ? $('div.room-info-ctnr.dp-i-block') : $('.rows-ctnr')

    if (buttonArea.length == 0){
        console.warn(`無法找到按鈕放置元素 ${'.rows-ctnr'}, 可能b站改了元素，請通知原作者。`)
        await sleep(1000)
        buttonArea = $('div.room-info-ctnr.dp-i-block').length ? $('div.room-info-ctnr.dp-i-block') : $('.rows-ctnr')
    }

    buttonArea.append(`
        <div class="dropdown-sc">
            <a href="javascript: void(0)" class="dropbtn-sc btn-sc" type="button">醒目留言记录</a>
            <div class="sc-btn-list">
                <a href="javascript: void(0)" type="button" id="sc-output" class="btn-sc">导出SC记录</a>
            </div>
            <div id="sc-list" class="dropdown-content-sc"></div>
            <style>
            .sc-btn-list {
                display: none;
                position: absolute;
                background-color: #f1f1f1;
                height: 50px;
                width: 300px;
                padding: 5px;
                box-shadow: 2px 2px 5px black;
                z-index: 1;
                text-align: center;
            }
            .dropdown-sc {
                position: relative;
                display: inline-block;
                padding: 5px;
            }
            .dropdown-content-sc {
                display: none;
                position: absolute;
                background-color: #f1f1f1;
                height: 300px;
                width: 300px;
                overflow-y: auto;
                padding: 5px;
                margin-top: 35px;
                box-shadow: 2px 2px 5px black;
                animation: y-down .3s ease-out;
                z-index: 1;
                scrollbar-width: thin;
                scrollbar-color: gray white;
                overflow-x: hidden;
            }
            .dropdown-content-sc::-webkit-scrollbar {
                width: 5px;
            }
            
            .dropdown-content-sc::-webkit-scrollbar-track {
                background-color: white;
            }
            
            .dropdown-content-sc::-webkit-scrollbar-thumb {
                background-color: gray;
            }
            </style>
        </div> 
    `)

    $('.dropbtn-sc').on('click', switchMenu)

    $('#sc-output').on('click', async () => {
        try {
            if (superChats.length === 0) throw new Error('SC记录为空。')
            const today = new Date().toISOString().substr(0, 10)
            download({
                filename: `${roomId}-${today}-superchats.log`,
                content: superChats.map(s => {
                    const time = new Date(s.timer * 1000).toTimeString().substr(0, 8)
                    return  `[${time}] [￥${s.price}] ${s.username}(${s.uid}): ${s.message}`
                }).join('\n')
            })
            await sendNotify({
                title: '导出成功',
                message: 'SuperChat 记录已成功导出'
            })
        }catch(err){
            console.error(err)
            await sendNotify({
                title: '导出失败',
                message: err?.message ?? err
            })
        }
    })

    for(const chat of superChats){
        const card = creatSuperChatCard(chat)
        $('div#sc-list').prepend(card)
    }

    if (!restart) getBeforeSuperChat()

    ws.addHandler('SUPER_CHAT_MESSAGE', command => {
        const { data } = command
        const object = {
            bg_color: data.background_color_start,
            bg_image: data.background_image,
            bg_header_color: data.background_color,
            user_icon: data.user_info.face,
            name_color: data.user_info.name_color,
            uid: data.uid,
            username: data.user_info.uname,
            price: data.price,
            message: data.message,
            timer: data.start_time
        }
        pushSuperChat(object)
    })
}

const superChats = []

function pushSuperChat(object){
    const card = creatSuperChatCard(object)
    $('div#sc-list').prepend(card)
    superChats.push(object)
}

let cfToken = generateToken()

window.addEventListener('bjf:superchats', ({detail: {scList, token}}) => {
    if (token !== cfToken) {
        console.warn('token not match, skipped')
        return
    }
    console.log(`received ${scList.length} current superchat records`)
    for (const data of scList){
        const object = {
            bg_color: data.background_bottom_color,
            bg_image: data.background_image,
            bg_header_color: data.background_color,
            user_icon: data.user_info.face,
            name_color: '#646c7a',
            uid: data.uid,
            username: data.user_info.uname,
            price: data.price,
            message: data.message,
            timer: data.start_time
        }
        pushSuperChat(object)
    }

    //refresh token
    cfToken = generateToken()
})

function getBeforeSuperChat(){
    const a = `
    <script>
        const scList = window.__NEPTUNE_IS_MY_WAIFU__ ? window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list : []
        const scEvent = new CustomEvent('bjf:superchats', { detail: {
            scList,
            token: '${cfToken}'
        }})
        window.dispatchEvent(scEvent)
    </script>
    `
    $(document.body).append(a)
}

export function cancelSuperChatFunction(){
    ws.clearHandlers('SUPER_CHAT_MESSAGE')
    $('.dropdown-sc').remove()
}
