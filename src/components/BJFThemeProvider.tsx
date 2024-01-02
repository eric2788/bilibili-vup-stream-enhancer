import { ThemeProvider } from "@material-tailwind/react";
import { usePreferredColorScheme } from "@react-hooks-library/core";
import { useEffect, useMemo } from "react";



export type SettingThemeProviderProps = {
    children: React.ReactNode
    dark?: boolean
    controller?: Element | Element[]
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


// controling material tailwind theme + tailwindcss dark mode
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