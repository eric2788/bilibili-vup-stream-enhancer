import { useEffect, useState } from 'react';
import { isDarkThemeBilbili } from '~utils/bilibili';

import { useMutationObserver } from '@react-hooks-library/core';

import BJFThemeDarkContext from '~contexts/BLiveThemeDarkContext';
import BJFThemeProvider from './BJFThemeProvider';

const fetchDarkMode = () => /*isDarkTheme() &&*/ isDarkThemeBilbili()

/**
 * BLiveThemeProvider component provides a theme context for the children components.
 *
 * @param children - The child components to be wrapped by the theme provider.
 * @param element - The element or elements to be used for checking dark/light theme from bilibili. If not provided, the document.documentElement will be used.
 * @returns The JSX element representing the theme provider.
 *
 * @example
 * ```tsx
 * <BLiveThemeProvider>
 *   <App />
 * </BLiveThemeProvider>
 * ```
 */
function BLiveThemeProvider({ children, element }: { children: React.ReactNode, element?: Element | Element[] }): JSX.Element {

  const themeContext = useState<boolean>(fetchDarkMode)

  const [dark, setDark] = useState(fetchDarkMode)

  const controller = element ?? document.documentElement

  // watch bilibili theme changes
  useMutationObserver(document.documentElement, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lab-style') {
        setDark(fetchDarkMode)
        break
      }
    }
  }, { attributes: true })

  useEffect(() => {
    setDark(fetchDarkMode)
  }, [])

  useEffect(() => {
    themeContext[1](dark)
  }, [dark])

  return (
    <BJFThemeDarkContext.Provider value={themeContext}>
      <BJFThemeProvider dark={dark} controller={controller}>
        {children}
      </BJFThemeProvider>
    </BJFThemeDarkContext.Provider>
  )
}



export default BLiveThemeProvider