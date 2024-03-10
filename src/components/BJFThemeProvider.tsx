import { useEffect, useMemo } from 'react';

import { ThemeProvider } from '@material-tailwind/react';
import { usePreferredColorScheme } from '@react-hooks-library/core';

/**
 * Props for the SettingThemeProvider component.
 */
export type SettingThemeProviderProps = {
    /**
     * The children components to be rendered.
     */
    children: React.ReactNode;
    
    /**
     * Whether to use the dark theme.
     */
    dark?: boolean;
    
    /**
     * The controller element(s) for the theme provider.
     */
    controller?: Element | Element[];
}

type MaterialTheme = {
    [components: string]: {
        defaultProps?: Record<string, any>,
        valid?: Record<string, any>,
        styles?: Record<string, any>
    }
}


const lightTheme: MaterialTheme = {
    input: {
        defaultProps: {
            color: 'black'
        }
    },
    typography: {
        defaultProps: {
            color: 'gray'
        }
    },
    switch: {
        defaultProps: {
            color: 'gray'
        }
    },
    iconButton: {
        defaultProps: {
            color: 'black'
        }
    },
    button: {
        defaultProps: {
            color: 'black'
        }
    }
}

const darkTheme = {
    input: {
        defaultProps: {
            color: 'white'
        }
    },
    typography: {
        defaultProps: {
            color: 'white'
        }
    },
    switch: {
        defaultProps: {
            color: 'brown'
        },
        styles: {
            base: {
                input: {
                    background: "bg-gray-500",
                }
            },
            colors: {
                'brown': {
                    input: "checked:bg-gray-900",
                    circle: "peer-checked:border-gray-200",
                    before: "peer-checked:before:bg-black",
                }
            }
        }
    },
    iconButton: {
        defaultProps: {
            color: 'white'
        }
    },
    button: {
        defaultProps: {
            color: 'white'
        }
    }
}


/**
 * BJFThemeProvider component provides a theme provider for the BJF application.
 * it also controls material tailwind theme + tailwindcss dark mode
 *
 * @param {SettingThemeProviderProps} props - The component props.
 * @param {ReactNode} props.children - The child components to be wrapped by the theme provider.
 * @param {boolean} props.dark - Indicates whether to use the dark theme. If `true`, the dark theme will be used. If `false`, the light theme will be used. If `undefined`, the theme will be determined based on the system color scheme.
 * @param {HTMLElement | HTMLElement[]} props.controller - The HTML element(s) to apply the theme class to. If an array is provided, the theme class will be applied to each element in the array. If `undefined`, the theme class will be applied to the `document.documentElement`.
 * 
 * @returns {JSX.Element} The JSX element representing the BJFThemeProvider component.
 *
 * @example
 * // Using BJFThemeProvider with dark theme
 * <BJFThemeProvider dark={true}>
 *   <App />
 * </BJFThemeProvider>
 *
 * @example
 * // Using BJFThemeProvider with light theme
 * <BJFThemeProvider dark={false}>
 *   <App />
 * </BJFThemeProvider>
 *
 * @example
 * // Using BJFThemeProvider with system color scheme
 * <BJFThemeProvider>
 *   <App />
 * </BJFThemeProvider>
 */
function BJFThemeProvider({ children, dark, controller }: SettingThemeProviderProps): JSX.Element {

    const systemColor = usePreferredColorScheme()
    const htmls = controller ? Array.isArray(controller) ? controller : [controller] : [document.documentElement]

    const theme = useMemo(() => {

        if (dark !== undefined) {
            return dark ? darkTheme : lightTheme
        }

        return systemColor === 'dark' ? darkTheme : lightTheme

    }, [dark, systemColor])

    useEffect(() => {

        const darkMedia = dark === true || (dark === undefined && systemColor === 'dark')
        if (darkMedia) {
            htmls.forEach(html => html.classList.add('dark'))
        } else {
            htmls.forEach(html => html.classList.remove('dark'))
        }
        console.info('set bjf dark theme to ', darkMedia ? 'dark' : 'light')

    }, [dark, systemColor])

    return (
        <ThemeProvider value={theme}>
            {children}
        </ThemeProvider>
    )
}


export default BJFThemeProvider