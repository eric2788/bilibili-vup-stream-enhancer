import { useState, useRef, useEffect } from "react"


export type SelectorOption<T> = {
    value: T
    label: string
}


export type SelectorProps<T> = {
    value: T
    onChange?: (value: T) => void
    label: string
    options: SelectorOption<T>[]
}



function Selector<T = any>(props: SelectorProps<T>): JSX.Element {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const pageClickEvent = (e: Event) => {
            // If the active element exists and is clicked outside of
            if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
                setIsOpen(!isOpen);
            }
        };

        // If the item is active (ie open) then listen for clicks
        if (isOpen) {
            window.addEventListener('click', pageClickEvent);
        }

        return () => {
            window.removeEventListener('click', pageClickEvent);
        }
    }, [isOpen]);



    const selectOption = (option: SelectorOption<T>) => {
        props.onChange && props.onChange(option.value);
        setIsOpen(false);
    }

    return (
        <section className="relative block text-left">
            <label className="text-sm ml-1 font-medium text-gray-900 dark:text-white">{props.label}</label>
            <div ref={dropdownRef} className="mt-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className={`inline-flex justify-between h-full w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-gray-500`}>
                    {props.options.find((option) => option.value === props.value)?.label ?? String(props.value)}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <div style={{ zIndex: 99 }} className={`origin-top relative overflow-y-visible w-full rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 ${isOpen ? 'transition-all ease-out duration-200 transform opacity-100 scale-100' : 'transition-all ease-in duration-75 transform opacity-0 scale-75'}`} role="menu" aria-orientation="vertical">
                    <div className={`py-1 overflow-visible ${isOpen ? 'visible' : 'hidden'}`} role="none">
                        {props.options.map((option, index) => (
                            <a key={index} onClick={() => selectOption(option)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-300" role="menuitem">{option.label}</a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Selector