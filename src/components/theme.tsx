import { ThemeProvider } from "@material-tailwind/react";
import { valid } from "semver";



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
}

const darkTheme = {
    input: {
        defaultProps: {
            color: 'white'
        }
    },
}


function BJFThemeProvider({ children, dark }: SettingThemeProviderProps): JSX.Element {

    const theme = dark === true ? darkTheme : lightTheme

    return (
        <ThemeProvider value={theme}>
            {children}
        </ThemeProvider>
    )
}


export default BJFThemeProvider