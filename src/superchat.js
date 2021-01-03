import { generateToken } from "./utils/misc";

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
            <div style="padding: 10px">
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
    $('.dropdown-content-sc').css('display', display)
    $('.dropbtn-sc').css('background-color', color)
  }

export async function launchSuperChatInspect(settings, { buttonOnly }){

    if (buttonOnly) return

    $('div.room-info-ctnr.dp-i-block').append(`
        <div class="dropdown-sc">
            <a href="javascript: void(0)" class="dropbtn-sc" type="button">醒目留言记录</a>
            <div id="sc-list" class="dropdown-content-sc"></div>
        </div>
        <style>
        .dropbtn-sc {
            background-color: gray;
            color: white;
            padding: 5px;
            font-size: 12px;
            border: none;
        }
        .dropdown-sc {
            position: relative;
            display: inline-block;
        }
        .dropdown-content-sc {
            display: none;
            position: absolute;
            background-color: #f1f1f1;
            height: 300px;
            width: 300px;
            overflow-y: auto;
            padding: 5px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            animation: y-down .3s ease-out;
            z-index: 1;
            scrollbar-width: thin;
            scrollbar-color: gray white;
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
    `)

    $('.dropbtn-sc').on('click', switchMenu)

    getBeforeSuperChat()

    window.addEventListener('ws:bilibili-live', ({ detail: { cmd, command } }) => {
        if (cmd !== 'SUPER_CHAT_MESSAGE') return
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
            message: data.message
        }
        const card = creatSuperChatCard(object)
        $('div#sc-list').prepend(card)
        /* record function
        if (settings.record){
            console.log('not yet done recording')
        }
        */
    })

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
            message: data.message
        }
        const card = creatSuperChatCard(object)
        $('div#sc-list').prepend(card)
    }

    //refresh token
    cfToken = generateToken()
})

function getBeforeSuperChat(){
    const a = `
    <script>
        const scList = window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list
        const event = new CustomEvent('bjf:superchats', { detail: {
            scList,
            token: '${cfToken}'
        } })
        window.dispatchEvent(event)
    </script>
    `
    $(document.body).append(a)
}

