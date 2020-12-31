import {getSettings, setSettings, sendNotify, checkUpdate} from './utils/messaging'

function getCurrentInput(){
    const setting = {}
    setting.regex = $('#reg-cap')[0].value
    setting.opacity = $('#opacity-jimaku')[0].valueAsNumber
    setting.color = $('#color-jimaku')[0].value
    setting.hideJimakuDanmaku = $('#hide-jimaku-danmaku').prop('checked')
    setting.record = $('#enable-record').prop('checked')
    setting.vtbOnly = $('#vtb-only').prop('checked')
    setting.backgroundSubtitleOpacity = $('#opacity-background')[0].valueAsNumber
    setting.backgroundColor = $('#background-jimaku')[0].value
    setting.subtitleColor = $('#color-subtitle')[0].value
    const rooms = new Set()
    $('ul#blacklist').children('li').each((i, e)=>{
        const room = $(e).attr('room')
        rooms.add(room)
    })
    setting.blacklistRooms = [...rooms]

    const tcmans = new Set()
    $('ul#tongchuan-mans').children('li').each((i, e) => {
        const user = $(e).attr('tc-man-id')
        tcmans.add(user)
    })

    setting.tongchuanMans = [...tcmans]
    

    setting.lineGap = $('#line-gap')[0].valueAsNumber
    setting.subtitleSize = $('#subtitle-size')[0].valueAsNumber
    setting.jimakuAnimation = $('#jimaku-animation')[0].value

    setting.useWebSocket = $('#use-web-socket').prop('checked')
    setting.webSocketSettings = {
        danmakuPosition: $('#danmaku-position')[0].value,
        forceAlterWay: $('#force-alter-way').prop('checked')
    }
    setting.useStreamingTime = $('#use-streaming-time').prop('checked')
    setting.useAsWhitelist = $('#use-whitelist').prop('checked')

    setting.backgroundHeight = $('#height-background')[0].valueAsNumber

    setting.buttonSettings = {
        backgroundListColor: $('#color-button-list-background')[0].value,
        backgroundColor: $('#color-button-background')[0].value,
        textColor: $('#color-button-text')[0].value
    }

    setting.filterCNV = $('#no-cn-v').prop('checked')
    setting.autoCheckUpdate = $('#auto-check-update').prop('checked')
    return setting
}

function appendBlackList(room){
    $('ul#blacklist').prepend(`<li class="list-group-item" room="${room}">
            <span>${room}</span>
            <a style="float: right" href="javascript: void(0)" id="${room}">刪除</a>
    </li>`)
    $(`a#${room}`).on('click', e => {
        $('ul#blacklist').children('li').filter((i, e) => $(e).attr('room') == room).each((i, e) => e.remove())
    })
}

$('#blacklist-add-btn').on('click', e => {
    e.preventDefault()
    if (!$('#add-blacklist')[0].checkValidity()){
        return
    }
    const room = $('#add-blacklist')[0].value
    if (room === undefined || room === '') return
    appendBlackList(room)
    $('#add-blacklist')[0].value = ''
})

function appendTongChuan(user){
    $('ul#tongchuan-mans').prepend(`<li class="list-group-item" tc-man-id="${user}">
            <span>${user}</span>
            <a style="float: right" href="javascript: void(0)" id="${user}">刪除</a>
    </li>`)
    $(`a#${user}`).on('click', e => {
        $('ul#tongchuan-mans').children('li').filter((i, e) => $(e).attr('tc-man-id') == user).each((i, e) => e.remove())
    })
}

$('#tcman-add-btn').on('click', e => {
    e.preventDefault()
    if (!$('#add-tcman')[0].checkValidity()){
        return
    }
    const user = $('#add-tcman')[0].value
    if (user === undefined || user === '') return
    appendTongChuan(user)
    $('#add-tcman')[0].value = ''
})

function saveCurrentInput(setting){
    $('#reg-cap')[0].value = setting.regex
    $('#opacity-jimaku')[0].valueAsNumber = setting.opacity

    $('#color-jimaku')[0].value = setting.color
    $('#color-jimaku-picker')[0].value = setting.color

    $('#hide-jimaku-danmaku').prop('checked', setting.hideJimakuDanmaku)
    $('#enable-record').prop('checked', setting.record)
    $('#vtb-only').prop('checked', setting.vtbOnly)

    $('#opacity-background')[0].valueAsNumber = setting.backgroundSubtitleOpacity

    $('#background-jimaku')[0].value = setting.backgroundColor
    $('#background-jimaku-picker')[0].value = setting.backgroundColor

    $('#color-subtitle')[0].value = setting.subtitleColor
    $('#color-subtitle-picker')[0].value = setting.subtitleColor

    $('#line-gap')[0].valueAsNumber = setting.lineGap

    $('#subtitle-size')[0].valueAsNumber = setting.subtitleSize

    for (const room of (setting.blacklistRooms ?? [])){
        appendBlackList(room)
    }

    for (const user of (setting.tongchuanMans ?? [])){
        appendTongChuan(user)
    }

    $('#use-web-socket').prop('checked', setting.useWebSocket)
    const { danmakuPosition, forceAlterWay } = setting.webSocketSettings
    $('#danmaku-position')[0].value = danmakuPosition
    $('#danmaku-position').attr('disabled', !setting.useWebSocket)
    $('#force-alter-way').prop('checked', forceAlterWay)
    $('label[for=force-alter-way]')[0].innerText = forceAlterWay ? '自动切换到第三方監控' : '询问切换到第三方監控'
    $('#force-alter-way').attr('disabled', !setting.useWebSocket)
    
    $('#use-streaming-time').prop('checked', setting.useStreamingTime)
    $('label[for=use-streaming-time]')[0].innerText = setting.useStreamingTime ? '使用串流时间戳记' : '使用真实时间戳记'

    $('#use-whitelist').prop('checked', setting.useAsWhitelist)

    $('#height-background')[0].valueAsNumber = setting.backgroundHeight

    const { backgroundListColor, backgroundColor, textColor } = setting.buttonSettings

    $('#color-button-list-background')[0].value = backgroundListColor
    $('#color-button-list-background-picker')[0].value = backgroundListColor

    $('#color-button-background')[0].value = backgroundColor
    $('#color-button-background-picker')[0].value = backgroundColor

    $('#color-button-text')[0].value = textColor
    $('#color-button-text-picker')[0].value = textColor

    $('#no-cn-v').prop('checked', setting.filterCNV)

    $('#jimaku-animation')[0].value = setting.jimakuAnimation
    
    $('#auto-check-update').prop('checked', setting.autoCheckUpdate)
}



hookColor('color-jimaku')
hookColor('background-jimaku')
hookColor('color-subtitle')
hookColor('color-button-list-background')
hookColor('color-button-background')
hookColor('color-button-text')




$('#save-settings').on('click', e => {
    const form = $('form#setting')
    if(form[0].checkValidity()){
        e.preventDefault()
        console.log('prepare to save:')
        const set = getCurrentInput()
        console.log(set)
        setSettings(set).then(() => {
            sendNotify({title: '设置成功', message: '你的设定已成功保存。'})
        }).catch(err => {
            console.error(err)
            sendNotify({title: '设置失敗', message: err.message})
        })
    }else{
        console.log(form.find(":invalid"))
        form.find(":invalid").parents('.collapse').collapse('show')
        sendNotify({title: '设置失败', message: '请检查是否有缺漏或格式错误。'})
    }
})


$('#clear-data').on('click', async e =>{
    e.preventDefault()
    try{
        if(window.confirm('决定删除所有直播房间的字幕记录?')){
            const tabs = await browser.tabs.query({url: '*://live.bilibili.com/*'})
            if (tabs.length > 0){
                await sendNotify({
                    title: '删除失败',
                    message: '检测到你有直播房间分页未关闭，请先关闭所有直播房间分页'
                })
            }else{
                const tab = await browser.tabs.create({
                    active: false,
                    url: 'https://live.bilibili.com'
                })
                
                await browser.tabs.executeScript(tab.id, {
                    code: `
                        for (const db of Object.keys(localStorage).filter(s => s.startsWith('live_room'))){
                            window.indexedDB.deleteDatabase(db)
                        }
                        true
                    `
                })
                await browser.tabs.remove(tab.id)
                await sendNotify({
                    title: '删除成功',
                    message: '资料库已被清空。'
                })
            }
        }
    }catch(err){
        console.error(err)
        await sendNotify({
            title: '删除失敗',
            message: err.message
        })
    }
})



$('#use-web-socket').on('change', e => {
    const checked =  $(e.target).prop('checked')
    $('#danmaku-position').attr('disabled', !checked)
    $('#force-alter-way').attr('disabled', !checked)
    if (!checked){
        $('#danmaku-position')[0].value = 'normal'
    }
})

$('#use-streaming-time').on('change', e => {
    const s = $(e.target).prop('checked')
    $('label[for=use-streaming-time]')[0].innerText = s ? '使用串流时间戳记' : '使用真实时间戳记'
})

$('#force-alter-way').on('change', e => {
    const s = $(e.target).prop('checked')
    $('label[for=force-alter-way]')[0].innerText = s ? '自动切换到第三方監控' : '询问切换到第三方監控'
})

function hookColor(from){
    $(`#${from}-picker`).on('change', e => {
        $(`#${from}`)[0].value = e.target.value
    })
}


async function assignValue(){
    const setting = await getSettings()
    console.log(setting)
    saveCurrentInput(setting)
}

$('#input-setting').on('click', async e =>{
    e.preventDefault()
    const files = $('#setting-file')[0].files
    if (files.length == 0){
        await sendNotify({
            title: '导入失败',
            message: '你未选择你的档案。'
        })
        return
    }
    const json = files[0]
    if (json.type !== 'application/json'){
        await sendNotify({
            title: '导入失败',
            message: '你的档案格式不是json。'
        })
        return
    }
    try {
        const settings = await readAsJson(json)
        await setSettings(settings)
        const newSetting = await getSettings()
        saveCurrentInput(newSetting)
        await sendNotify({
            title: '导入成功',
            message: '你的设定档已成功导入并储存。'
        })
    }catch(err){
        console.error(err)
        await sendNotify({
            title: '导入失败',
            message: err.message ?? err
        })
    }finally{
        $('#setting-file').val('')
    }
})

$('#output-setting').on('click', async e => {
    e.preventDefault()
    try {
        const set = await getSettings()
        const txt = JSON.stringify(set)
        const a = document.createElement("a");
        const file = new Blob([txt], { type: 'application/json' });
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = `bilibili-jimaku-filter-settings.json`
        a.click();
        URL.revokeObjectURL(url)
        await sendNotify({ title: '导出成功', message: '你的设定档已成功导出。' })
    }catch(err){
        console.error(err)
        await sendNotify({
            title: '导出失败',
            message: err.message ?? err
        })
    }
})


$('#check-update').on('click', checkUpdate)

async function readAsJson(json){
    return new Promise((res, rej)=>{
        const reader = new FileReader()
        reader.onload = function(e){
            try{
                res(JSON.parse(e.target.result))
            }catch(err){
                rej(err)
            }
        }
        reader.onerror = function(){
            rej(reader.error)
        }
        reader.readAsText(json)
    })
}


assignValue().catch(console.error)