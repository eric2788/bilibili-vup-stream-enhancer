import { useMemo } from "react";


export function useComputedStyle(element: Element): CSSStyleDeclaration {
    return useMemo(() => window.getComputedStyle(element), [element]);
}

export function useContrast(background: Element) {
    const { backgroundColor: rgb } = useComputedStyle(background);
    return useMemo(() => {
        const r = parseInt(rgb.slice(4, rgb.indexOf(',')));
        const g = parseInt(rgb.slice(rgb.indexOf(',', rgb.indexOf(',') + 1)));
        const b = parseInt(rgb.slice(rgb.lastIndexOf(',') + 1, -1));
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return {
            brightness,
            color: brightness > 125 ? 'black' : 'white',
            dark: brightness > 125
        };
    }, [rgb]);
}