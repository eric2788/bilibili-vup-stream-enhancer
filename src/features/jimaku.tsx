import { createPortal } from "react-dom";
import type { FeatureHookRender } from ".";
import TailwindScope from "~components/TailwindScope";
import type { Settings } from "~settings";



function JimakuArea({settings}: {settings: Settings}): JSX.Element {

    const jimakuStyle = settings['settings.jimaku']

    return (
        <div style={{
            height: jimakuStyle.backgroundHeight,
            backgroundColor: jimakuStyle.backgroundColor,
            color: jimakuStyle.color,
            fontSize: jimakuStyle.size,
            textAlign: jimakuStyle.position,
            scrollbarWidth: 'thin',
            scrollbarColor: `${jimakuStyle.color} ${jimakuStyle.backgroundColor}`
        }} className=" z-10 overflow-y-auto overflow-x-hidden w-full">

        </div>
    )
}

const handler: FeatureHookRender = async (settings, info) => {
    console.info('hello world from jimaku.tsx!')

    const dev = settings['settings.developer']

    const playerSection = document.querySelector('div.player-section')
    const jimakuArea = document.createElement('div')
    jimakuArea.id = 'jimaku-area'
    playerSection.insertAdjacentElement('afterend', jimakuArea)

    return [
        createPortal(
            <TailwindScope>
                <JimakuArea />
            </TailwindScope>
        , jimakuArea)
    ]
}

export default handler