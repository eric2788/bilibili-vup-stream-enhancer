import styleCss from 'data-text:~style.css';

let style = document.getElementById('bjf-tailwindcss')
if (style == null) {
    style = document.createElement("style")
    style.id = 'bjf-tailwindcss'
    style.textContent = styleCss
    document.head.appendChild(style)
}

export function injectTailwind(element: Element, scoped: boolean = true) {
    const style = document.createElement('style')
    style.textContent = styleCss
    if (scoped) {
        style.setAttribute('scoped', '')
    }
    element.appendChild(style)
}