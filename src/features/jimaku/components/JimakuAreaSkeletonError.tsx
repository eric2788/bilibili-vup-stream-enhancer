import { Fragment, useContext } from "react"
import JimakuFeatureContext from "~contexts/JimakuFeatureContext"

export type JimakuAreaSkeletonErrorProps = {
    error: Error | any
    retry: VoidFunction
}

function JimakuAreaSkeletonError({ error, retry }: JimakuAreaSkeletonErrorProps): JSX.Element {
    
    const { jimakuZone: jimakuSettings, buttonZone: buttonSettings } = useContext(JimakuFeatureContext)
    const { backgroundHeight, backgroundColor, firstLineSize, lineGap, size } = jimakuSettings
    const { backgroundListColor } = buttonSettings
    
    return (
        <Fragment>
            <div style={{ height: backgroundHeight, backgroundColor }} className="flex flex-col justify-start text-lg items-center gap-3 text-red-400">
                <h1 style={{ fontSize: firstLineSize, margin: `${lineGap}px 0px` }} className="font-bold">加载失败</h1>
                <span style={{ fontSize: size }}>{String(error)}</span>
            </div>
            <div style={{ backgroundColor: backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
                <button onClick={retry} className="m-[5px] px-[20px] py-[10px] text-[15px] bg-red-700 rounded-md">
                    重试
                </button>
            </div>
        </Fragment>
    )
}

export default JimakuAreaSkeletonError