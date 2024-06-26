import { Fragment, useDeferredValue, useState, type MouseEventHandler } from "react"
import { Rnd } from "react-rnd"

/**
 * Props for the DraggableFloatingButton component.
 */
export type DraggableFloatingButtonProps = {
    /**
     * Event handler for the button click event.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;

    /**
     * The content of the button.
     */
    children: React.ReactNode;

    /**
     * Additional CSS class name for the button.
     */
    className?: string;

    /**
     * Inline styles for the button.
     */
    style?: React.CSSProperties;

    /**
     * The initial X position of the button.
     */
    initX?: number;

    /**
     * The initial Y position of the button.
     */
    initY?: number;
}


/**
 * Renders a draggable floating button component.
 *
 * @param {DraggableFloatingButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Example usage of DraggableFloatingButton component
 * <DraggableFloatingButton
 *   onClick={() => console.log('Button clicked')}
 *   className="bg-blue-500"
 *   style={{ fontSize: '16px' }}
 * >
 *   Click me
 * </DraggableFloatingButton>
 */
function DraggableFloatingButton(props: DraggableFloatingButtonProps): JSX.Element {

    const { 
        onClick, 
        children, 
        className, 
        style, 
        initX = window.innerWidth - 500, 
        initY = 96 
    } = props

    const colorClass = className ?? 'bg-red-600 duration-150 hover:bg-red-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white'

    const [position, setPosition] = useState({ x: initX, y: initY })
    const pos = useDeferredValue(position)

    return (
        <Fragment>
            <button
                onClick={onClick}
                style={{
                    ...style,
                    left: pos.x,
                    top: pos.y,
                    width: 85,
                    height: 85
                }}
                className={`absolute group rounded-full p-3 drop-shadow-lg flex flex-col justify-center items-center gap-3 ${colorClass}`}>
                {children}
            </button>
            <Rnd
                bounds={document.body}
                enableResizing={false}
                className="rounded-full fixed"
                onDrag={(_, d) => setPosition({ x: (d.x - 60), y: (d.y - 5) })}
                default={{
                    x: initX+60,
                    y: initY+5,
                    width: 25,
                    height: 25,
                }}
            >
                <div data-type="draggable-button" className="w-full h-full rounded-full bg-white flex justify-center items-center">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x={0} y={0}
                        viewBox="0 0 18 18" enableBackground="new 0 0 18 18" xmlSpace="preserve">
                        <path fill="#ffffff" d="M9,1L1,9l5.2,5.2L9,17l8-8L9,1z M7,12H6v-1h1V12z M7,7H6V6h1V7z M12,12h-1v-1h1V12z M11,6h1v1h-1V6z" />
                        <polygon points="15.6,9 13,6.2 13,8 9,8 5,8 5,6.2 2.4,9 5,11.8 5,10 9,10 13,10 13,11.8 " />
                        <polygon points="10,9 10,9 10,5 11.8,5 9,2.4 6.2,5 8,5 8,9 8,9 8,13 6.2,13 9,15.6 11.8,13 10,13 " />
                    </svg>
                </div>
            </Rnd>
        </Fragment>
    )
}


export default DraggableFloatingButton