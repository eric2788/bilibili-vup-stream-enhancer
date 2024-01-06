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


export function injectScriptElement(code: string, element: Element = document.body) {
    const script = document.createElement('script')
    script.textContent = code
    element.appendChild(script)
}