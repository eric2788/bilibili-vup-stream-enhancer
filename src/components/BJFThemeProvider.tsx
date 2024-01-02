import { ThemeProvider, iconButton } from "@material-tailwind/react";
import { usePreferredColorScheme } from "@react-hooks-library/core";
import { useEffect, useMemo, useState } from "react";



export type SettingThemeProviderProps = {
    children: React.ReactNode
    dark?: boolean
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
            color: 'blue-gray'
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
    }
}


function BJFThemeProvider({ children, dark }: SettingThemeProviderProps): JSX.Element {

    const systemColor = usePreferredColorScheme()
    const theme = useMemo(() => {

        if (dark !== undefined) {
            return dark ? darkTheme : lightTheme
        }

        return systemColor === 'dark' ? darkTheme : lightTheme

    }, [dark, systemColor])

    return (
        <ThemeProvider value={theme}>
            {children}
        </ThemeProvider>
    )
}


export default BJFThemeProvider