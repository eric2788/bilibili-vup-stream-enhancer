import React from 'react'

/**
 * Checks if the given node is an iterable node.
 * @param node - The node to check.
 * @returns True if the node is an array of React nodes, false otherwise.
 */
export function isIterableNode(node: React.ReactNode): node is Array<React.ReactNode> {
    return node instanceof Array
}

/**
 * Finds a static component within the given React node tree.
 * 
 * @param children - The React node tree to search within.
 * @param name - The name of the component to find.
 * @returns The found React node if it matches the given name, otherwise null.
 */
export function findStaticComponent(children: React.ReactNode, name: string): React.ReactNode {
    if (isIterableNode(children)) {
        return children.find((child: any) => child.type.name === name)
    }
    return null
}


/**
 * Injects a script element with the specified code into the given element.
 * If no element is provided, the script element will be appended to the document body.
 * 
 * @param code The code to be injected as the content of the script element.
 * @param element The element to which the script element should be appended. Defaults to document.body.
 */
export function injectScriptElement(code: string, element: Element = document.body) {
    const script = document.createElement('script')
    script.textContent = code
    element.appendChild(script)
}