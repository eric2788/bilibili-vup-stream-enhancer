import { useMemo } from "react";


/**
 * Hook to get the computed style of a given DOM element.
 *
 * @param {Element} element - The DOM element to get the computed style for.
 * @returns {CSSStyleDeclaration} The computed style of the given element.
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const computedStyle = useComputedStyle(element);
 * console.log(computedStyle.color); // Outputs the color style of the element
 * ```
 */
export function useComputedStyle(element: Element): CSSStyleDeclaration {
    return useMemo(() => element ? window.getComputedStyle(element) : {} as CSSStyleDeclaration, [element]);
}

/**
 * Calculates the contrast of a given background element and returns an object
 * containing the brightness, appropriate text color, and a boolean indicating
 * if the background is dark.
 *
 * @param {Element} background - The background element to compute the contrast for.
 * @returns {Object} An object containing:
 * - `brightness` {number} - The brightness value of the background color.
 * - `color` {string} - The text color that contrasts with the background ('black' or 'white').
 * - `dark` {boolean} - A boolean indicating if the background is dark (true if brightness > 125).
 *
 * @example
 * const backgroundElement = document.getElementById('myElement');
 * const contrast = useContrast(backgroundElement);
 * console.log(contrast.brightness); // e.g., 150
 * console.log(contrast.color); // 'black'
 * console.log(contrast.dark); // true
 */
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