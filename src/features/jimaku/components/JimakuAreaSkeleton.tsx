import { Fragment, useContext } from "react";
import JimakuFeatureContext from "~contexts/JimakuFeatureContext";

function JimakuAreaSkeleton(): JSX.Element {

    const { jimakuZone: jimakuSettings, buttonZone: buttonSettings } = useContext(JimakuFeatureContext)
    const { backgroundHeight, backgroundColor, color, firstLineSize, lineGap } = jimakuSettings
    const { backgroundListColor } = buttonSettings

    return (
        <Fragment>
            <div style={{ height: backgroundHeight, backgroundColor }} className="flex justify-center items-start">
                <h1 style={{ color, fontSize: firstLineSize, marginTop: lineGap }} className="animate-pulse font-bold">字幕加载中...</h1>
            </div>
            <div style={{ backgroundColor: backgroundListColor }} className="text-center overflow-x-auto flex justify-center gap-3">
                {...Array(3).fill(0).map((_, i) => {
                    // make random skeleton width
                    const width = [120, 160, 130][i]
                    return (
                        <div key={i} style={{ width: width }} className="m-[5px] px-[20px] py-[10px] rounded-md text-[15px] animate-pulse bg-gray-300">
                            &nbsp;
                        </div>
                    )
                })}
            </div>
        </Fragment>
    )
}

export default JimakuAreaSkeleton