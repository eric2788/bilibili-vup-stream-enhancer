import { useState } from "react";

export function useForceUpdate(): [ any, () => void ] {
    const [deps, setDeps] = useState({})
    return [
        deps,
        () => setDeps({})
    ] as const
}

export function useForceRender(): () => void {
    const [, forceUpdate] = useForceUpdate()
    return forceUpdate
}