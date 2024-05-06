import { Fragment } from "react"


export type ButtonSwitchListProps = {
    onClick: VoidFunction
    switched: boolean
}

function ButtonSwitchList(props: ButtonSwitchListProps): JSX.Element {

    const { onClick, switched } = props

    return (
        <Fragment>
            <button
                style={{
                    backgroundColor: switched ? '#4CAF50' : '#f44336',
                    color: 'white'
                }}
                onClick={onClick}
                className="px-[5px] ml-[5px] py-[3px] rounded-md hover:brightness-90 shadow-md transition-all duration-300 ease-in-out"
            >
                切换字幕按钮列表
            </button>
        </Fragment>
    )
}


export default ButtonSwitchList