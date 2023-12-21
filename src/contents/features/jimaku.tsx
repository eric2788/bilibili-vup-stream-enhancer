import type { FeatureHookRender } from ".";


const handler: FeatureHookRender = async (settings, info) => {
    console.info('hello world from jimaku.tsx!')
    return []
}

export default handler