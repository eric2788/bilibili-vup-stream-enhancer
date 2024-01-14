
import styleText from 'data-text:./style.css'
import styleTextFirefox from 'data-text:./style.firefox.css'
import styleTextChromium from 'data-text:./style.chromium.css'

function getStyleTextByBrowser(): string {
    return process.env.PLASMO_BROWSER === 'firefox' ?
        styleTextFirefox :
        styleTextChromium
}

const styleContent = `
    ${styleText}
    ${getStyleTextByBrowser()}
`

export default styleContent