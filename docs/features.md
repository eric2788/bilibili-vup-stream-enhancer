## 新增功能

> 本扩展基于 [Plasmo CSUI](https://docs.plasmo.com/framework/content-scripts-ui) 进行前端渲染。

如要新增功能，你需要到以下地方新增(其余未列明的地方均为可选)：

```
src/
    features/ <- 內容腳本
    settings/
        features/ <- 功能设定区块
```

`src/features/`: 此目录用于存放功能，虽然主要集中在内容脚本的渲染，但是也是定义结构的地方，因此必须添加。

`src/settings/features/`: 此目录用于存放功能的设定区块，为了让用户能够切换功能的开关，此处也必须添加。

### 新增内容脚本

在 `src/features/` 目录下新增一个新的内容脚本，例如 `src/features/hello-world.tsx`。

根据 `src/features/index.ts`，你需要定义三个东西，其中两个为可选:
```ts
export type FeatureHookRender = (settings: Readonly<Settings>, info: StreamInfo) => Promise<(React.ReactPortal | React.ReactNode)[] | undefined>
export type FeatureAppRender = React.FC<{}>

export interface FeatureHandler {
    default: FeatureHookRender,
    App?: FeatureAppRender,
    FeatureContext?: React.Context<any>
}
```

以下为定义 `src/features/hello-world.tsx` 的范例:

```tsx
// 忽略 import....
const handler: FeatureHookRender = async (settings, info) => {
    // settings 是用户设定的内容
    // info 是当前直播间的信息
    // 返回的则是在内容脚本中的每个部件渲染，支援 react portal 以使用与网页元素挂钩
    // 如果不使用portal, 则默认在扩展专用的 shadow-root 进行渲染
    // 如果你不想在内容脚本中渲染任何东西，可以返回空数组 []
    // 如果你想基于条件禁用功能，可以返回 undefined
    return [
        <div>Hello, World!</div>, // 在 shadow-root 内渲染
        createPortal(<div>Hello, World!</div>, document.body) // 在网页元素内渲染
    ]
}

// FeatureContext 主要用于提供该功能所属的设定内容（即功能设定区块内的内容）
// 一般情况下，FeatureContext 理应在 src/contexts/ 下创建以供其他 React 组件使用，但此处为了简化，直接在内容脚本内创建
// 如果不需要提供设定内容，可以忽略 FeatureContext
export const FeatureContext = createContext<SettingsSchema>(null)

// 此处的渲染将直接在扩展专用的 shadow-root 内进行
// 此处与 FeatureHookRender 不同的地方在于，FeatureHookRender 可以在正式渲染 React 组件之前进行异步操作
// 同样，此处为可选。
export function App(): JSX.Element {
    return (
        <div>hello world from app</div>
    )
}

export default handler
```

一般情况下，功能都需要在内容脚本渲染其组件。假设你的功能不需要渲染任何内容，你可以这样定义：

```tsx

const handler: FeatureHookRender = async (settings, info) => {
    return [] // 不渲染任何东西
}

export default handler;

```

注意：如果你返回的是 `undefined`，则意味着你的功能将被禁用。

完成後，別忘了到 `src/features/index.ts` 中新增你的功能：

```ts
import * as jimaku from './jimaku'
import * as superchat from './superchat'
import * as helloWorld from './hello-world' // 新增的功能

//...

const features = {
    jimaku, 
    superchat,
    helloWorld // 新增的功能
}

//...

```

### 新增功能设定区块

在 `src/settings/features/` 目录下新增一个新的功能设定区块，例如 `src/settings/features/hello-world.tsx`:

```tsx

// 用于显示在功能设定区块的标题
export const title: string = 'Hello, World 功能'

export const define: FeatureSettingsDefinition = {
    // 此处使用 false 为标示你的功能不支援离线记录
    // 本节将忽略离线记录的内容
    offlineTable: false 
}

// 这里用于定义你的功能的设定结构
export type FeatureSettingSchema = {
    name: string
    age: string
}

// 这里用于定义你的功能的默认设定内容
export const defaultSettings: Readonly<FeatureSettingSchema> = {
    name: 'world',
    age: 99
}

// 这里用于渲染你的功能的设定区块
function SuperchatFeatureSettings({state, useHandler}: StateProxy<FeatureSettingSchema>): JSX.Element {

    // 此处为 StateProxy 的使用范例, 详情请自行查看 hooks 文档
    const stringHandler = useHandler<ChangeEvent<HTMLInputElement>>((e) => e.target.value)
    const numberHandler = useHandler<ChangeEvent<HTMLInputElement>, number>((e) => e.target.valueAsNumber)

    return (
        <div className="grid max-md:grid-cols-1 md:grid-cols-2 gap-10">
            <Input onChange={stringHandler('name')} value={state.name} placeholder="name" />
            <Input onChange={numebrHandler('age')} value={state.age} placeholder="age" type="number" />
        </div>
    )
}


export default SuperchatFeatureSettings
```

> 有关 `StateProxy` 的使用，请参考 [自定义Hooks](/src/hooks/binding.ts)。


同样，假设你的功能不需要功能设定区块，你可以这样定义：

```tsx
export const title: string = 'Hello, World 功能'

export const define: FeatureSettingsDefinition = {
    offlineTable: false 
}

export type FeatureSettingSchema = {
    // 无设定内容
}

export const defaultSettings: Readonly<FeatureSettingSchema> = {
    // 无设定内容
}

export default function HelloFeatureSettings(): JSX.Element {
    return <></> // 不渲染任何东西
}
```

有关设定的更多详细信息，你可以参考 [`docs/settings.md`](/docs/settings.md) 文档。


完成後，別忘了到 `src/settings/features/index.ts` 中新增你的功能设定区块：

```ts

import * as jimaku from './jimaku'
import * as superchat from './superchat'
import * as helloWorld from './hello-world' // 新增的功能

// ...

const featureSettings = {
    jimaku,
    superchat,
    helloWorld // 新增的功能
}

// ...
```

以上两个步骤完成后，你的功能就已经基本完成了。

### 进阶开发

你可以参考以下的源码以进行更进阶的功能开发:
- [现成功能参考](/src/features/)
- [功能设定区块参考](/src/settings/features/)
- [自定义Hooks](/src/hooks/)
- [自定义Context](/src/contexts/)
- [辅助函数](/src/utils/)
- [全局组件](/src/components)
- [设定区块用组件](/src/settings/components/)