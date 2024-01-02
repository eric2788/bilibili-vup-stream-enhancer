import { useEffect, useState } from 'react';
import { isDarkThemeBilbili } from '~utils/bilibili';
import { isDarkTheme } from '~utils/misc';

import { useMutationObserver } from '@react-hooks-library/core';

import BJFThemeProvider from './BJFThemeProvider';

const fetchDarkMode = () => /*isDarkTheme() &&*/ isDarkThemeBilbili()

function BLiveThemeProvider({ children, element }: { children: React.ReactNode, element?: Element | Element[] }): JSX.Element {

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

  return (
    <BJFThemeProvider dark={dark} controller={controller}>
      {children}
    </BJFThemeProvider>
  )
}



export default BLiveThemeProvider