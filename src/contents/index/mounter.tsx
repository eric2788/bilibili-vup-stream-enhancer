import { memo } from "react"
import { createRoot, type Root } from "react-dom/client"
import { toast } from "sonner/dist"
import { ensureLogin, type StreamInfo } from "~api/bilibili"
import { sendForward } from "~background/forwards"
import BLiveThemeProvider from "~components/BLiveThemeProvider"
import ContentContext from "~contexts/ContentContexts"
import type { FeatureType } from "~features"
import features from "~features"
import type { Settings } from "~options/fragments"
import { shouldInit } from "~options/shouldInit"
import { getStreamInfoByDom } from "~utils/bilibili"
import { injectAdapter } from "~utils/inject"
import { addBLiveMessageCommandListener, sendMessager } from "~utils/messaging"
import { findOrCreateElement } from "~utils/react-node"
import { getFullSettingStroage } from "~utils/storage"
import App from "./App"

interface RootMountable {
    feature: FeatureType
    mount: (settings: Settings) => Promise<void>
    unmount: () => Promise<void>
}

interface PlasmoSpec {
    rootContainer: Element
}


interface App {
    start(): Promise<void>
    stop(): Promise<void>
}

// createMountPoints will not start or the stop the app
function createMountPoints(plasmo: PlasmoSpec, info: StreamInfo): RootMountable[] {

    const { rootContainer } = plasmo

    return Object.entries(features).map(([key, handler]) => {

        const { default: hook, App, FeatureContext: Context } = handler
        const feature = key as FeatureType
        // this root is feature root
        let root: Root = null

        return {
            feature,
            mount: async (settings: Settings) => {

                // feature whitelist/blacklist
                const roomList = settings['settings.features'].roomList[feature]

                if (roomList.list.length > 0) {
                    if (roomList.list.some(r => r.room === info.room) === roomList.asBlackList) {
                        console.info(`房間 ${info.room} 已被 ${key} 功能黑名單，已略過`)
                        return
                    }
                }

                const portals = await hook(settings, info)
                // 返回禁用狀態的話則直接跳過渲染
                if (typeof portals === 'string') {
                    toast.warning(portals, { position: 'top-center' })
                    return
                } else if (!portals) {
                    console.info(`房間 ${info.room} 已被 ${key} 功能禁用，已略過`)
                    return
                }

                const FeatureContextProvider: React.FC<{ children: React.ReactNode, context?: React.Context<any>, value: any }> = memo((props) => {
                    const { children, context: Context, value } = props
                    if (!Context) return children
                    return (
                        <Context.Provider value={value}>
                            {children}
                        </Context.Provider>
                    )
                })
                const section = findOrCreateElement('section', `bjf-feature-${key}`, rootContainer)
                root = createRoot(section)
                root.render(
                    <BLiveThemeProvider element={section}>
                        <ContentContext.Provider value={{ settings, info }}>
                            <FeatureContextProvider context={Context} value={settings['settings.features'][feature]}>
                                {App && <App />}
                                {portals}
                            </FeatureContextProvider>
                        </ContentContext.Provider>
                    </BLiveThemeProvider>
                )
            },
            unmount: async () => {
                if (root === null) {
                    return
                }
                root.unmount()
                rootContainer.querySelector(`section#bjf-feature-${key}`)?.remove()
            }
        }
    })

}



function createApp(roomId: string, plasmo: PlasmoSpec, info: StreamInfo): App {

    const { rootContainer } = plasmo
    const mounters = createMountPoints({ rootContainer }, info)

    const section = findOrCreateElement('section', 'bjf-root', rootContainer)

    // this root is main root
    let root: Root = null
    let removeListener: VoidFunction = null
    return {
        async start(): Promise<void> {

            const settings = await getFullSettingStroage()
            const enabled = settings['settings.features'].enabledFeatures
            const forceBoot = settings['settings.developer'].extra.forceBoot

            // 如果沒有取得直播資訊，就嘗試使用 DOM 取得
            if (!info) {
                info = getStreamInfoByDom(roomId, settings)
            }

            // 依然無法取得，就略過
            if (!info) {
                console.warn('無法取得直播資訊，已略過: ', roomId)
                return
            }

            // 強制啓動
            if (forceBoot) {
                info.status = 'online'
            }

            if (!(await shouldInit(settings, info))) {
                console.info('不符合初始化條件，已略過')
                return
            }

            const login = await ensureLogin()

            console.info('login: ', login)

            if (!login) {
                toast.warning('检测到你尚未登录, 本扩展的功能将会严重受限, 建议你先登录B站。', { position: 'top-center' })
            }

            // hook adapter (only when online or forceBoot)
            if (info.status === 'online') {
                console.info('開始注入適配器....')
                const adapterType = settings["settings.capture"].captureMechanism
                const hooking = injectAdapter({ command: 'hook', type: adapterType, settings: settings })
                toast.dismiss()
                toast.promise(hooking, {
                    loading: '正在挂接直播监听...',
                    success: '挂接成功',
                    position: 'top-left',
                    duration: 4000,
                })
                try {
                    await hooking
                } catch (err: Error | any) {
                    console.error('hooking error: ', err)
                    toast.dismiss()
                    toast.error('挂接失敗: ' + err.message, {
                        action: {
                            label: '重試',
                            onClick: () => this.start()
                        },
                        position: 'top-left',
                        duration: 6000000,
                        dismissible: false
                    })
                    return
                }
                console.info('注入適配器完成')
            } else {
                console.info('直播尚未開始或已下線，將不會注入適配器')
                // 但依然會渲染元素
            }

            // 渲染主元素
            root = createRoot(section)
            console.info('開始渲染主元素....')
            root.render(
                <BLiveThemeProvider element={section}>
                    <ContentContext.Provider value={{ settings, info }}>
                        <App />
                    </ContentContext.Provider>
                </BLiveThemeProvider>
            )
            console.info('渲染主元素完成')

            // 渲染功能元素
            console.info('開始渲染元素....')
            await Promise.all(mounters.filter(m => enabled.includes(m.feature)).map(m => m.mount(settings)))
            console.info('渲染元素完成')

            // change to use global data in the future
            removeListener = addBLiveMessageCommandListener('DANMU_MSG', (data) => {
                const uname = data.info[2][1]
                const text = data.info[1]
                if (Array.isArray(text)) return
                const color = data.info[0][3]
                const position = data.info[0][1]
                sendForward('pages', 'danmaku', { uname, text, color, position, room: info.room })
            })

        },
        stop: async () => {
            if (root === null) {
                console.warn('root is null, maybe not mounted yet')
                return
            }

            if (removeListener) {
                removeListener()
            }

            // unhook adapters
            if (info.status === 'online') {
                console.info('開始移除適配器....')
                const unhooking = sendMessager('hook-adapter', { command: 'unhook' })
                toast.dismiss()
                toast.promise(unhooking, {
                    loading: '正在移除直播监听挂接...',
                    success: '移除成功',
                    error: (err) => '移除失敗: ' + err,
                    position: 'top-left'
                })
                await unhooking
                console.info('移除適配器完成')
            } else {
                console.info('直播尚未開始或已下線，無需移除適配器')
            }

            // 卸載功能元素
            console.info('開始卸載元素....')
            await Promise.all(mounters.map(m => m.unmount()))
            console.info('卸載元素完成')

            // 卸載主元素
            console.info('開始卸載主元素....')
            root.unmount()
            console.info('卸載主元素完成')

        }
    }
}


export default createApp