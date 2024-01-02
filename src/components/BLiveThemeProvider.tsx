import { useMutationObserver } from "@react-hooks-library/core"
import { useState } from "react"
import { isDarkThemeBilbili } from "~utils/bilibili"
import { isDarkTheme } from "~utils/misc"
import BJFThemeProvider from "./BJFThemeProvider"

function BLiveThemeProvider({children, element}: { children: React.ReactNode, element?: Element | Element[] }): JSX.Element {
    
    const [dark, setDark] = useState(() => isDarkTheme() && isDarkThemeBilbili())

    const controller = element ?? document.documentElement

    // watch bilibili theme changes
    useMutationObserver(document.documentElement, (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lab-style') {
          setDark(() => isDarkTheme() && isDarkThemeBilbili())
        }
      }
    }, { attributes: true })

    return (
        <BJFThemeProvider dark={dark} controller={controller}>
            {children}
        </BJFThemeProvider>
    )
}



export default BLiveThemeProvider