# 新增设定区块

如要新增页面，只需要到以下地方新增即可：

```
src/
    options/
        fragments/ <- 设定区块列表
```

## 创建一个新的设定区块

在 `src/options/fragments/` 目录下新增一个新的设定区块，例如 `src/options/fragments/hello-world.tsx`。

```tsx

// 定义设定区块的数据结构
export type SettingSchema = {
    name: string
    age: string
}

// 定义设定区块的默认值
export const defaultSettings: Readonly<SettingSchema> = {
    name: 'John Doe',
    age: '18'
}

// 设定区块的标题
export const title = 'Hello, World 设定'

// 设定区块的描述
export const description = [
    '此处的描述将会显示在设定页面的用户导航中。参考: src/components/Tutorial.tsx',
]

// 设定区块的渲染内容
function HelloWorldSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    return (
        <div>
            <input
                type="text"
                value={state.name}
                onChange={e => state.name = e.target.value}
            />
            <input
                type="number"
                value={state.age}
                onChange={e => state.age = e.target.value}
            />
        </div>
    )
}

export default HelloWorldSettings
```

### 使用 `StateProxy` 进行数据双向绑定

厌倦了每次写 React 都要手动处理 `onChange` ？ 你可以使用本扩展内置的 `StateProxy` 进行数据双向绑定。

```tsx
function HelloWorldSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    // 泛型参数为事件类型和目标值类型，这里是输入框的事件和提取输入框的值
    // 目标值类型默认为 string, 如果你的目标值类型不是 string, 你可以传入第二个泛型参数
    // 函数参数则为提取目标值的函数
    // 例如这里的 `e => e.target.value` 就是提取输入框的值 于 对应的 `string` 类型
    const stringHandler = useHandler<ChangeEvent<HTMLInputElement>>((e) => e.target.value)
    const numberHandler = useHandler<ChangeEvent<HTMLInputElement>, number>((e) => e.target.valueAsNumber)

    return (
        <div>
            <input
                type="text"
                value={state.name}
                onChange={stringHandler('name')}
            />
            <input
                type="number"
                value={state.age}
                onChange={numberHandler('age')}
            />
        </div>
    )
}
```

<details>
<summary>甚至...</summary>

```tsx
function HelloWorldSettings({ state, useHandler }: StateProxy<SettingSchema>): JSX.Element {

    const handler = useHandler<ChangeEvent<HTMLInputElement>>((e) => e.target.value)

    const strHandle = (key: PickLeaves<SettingSchema, string>) => {
        value: state[key],
        onChange: handler(key)
    }

    return <input {...strHandle('name')} type="text">
}
```

</details>


> 有关 `StateProxy` 的使用，请参考 [自定义Hooks](/src/hooks/binding.ts)。


完成后，你需要到 `src/options/fragments.ts` 中新增你的设定区块：

```ts
// ...
import * as capture from './fragments/capture'
import * as developer from './fragments/developer'
import * as display from './fragments/display'
import * as features from './fragments/features'
import * as listings from './fragments/listings'
import * as helloWorld from './fragments/hello-world' // 新增的设定区块

// ...

// 此处也设置了设定区块的顺序
const fragments = {
    'settings.features': features,
    'settings.listings': listings,
    'settings.capture': capture,
    'settings.display': display,
    'settings.developer': developer
    'settings.helloWorld': helloWorld // 新增的设定区块
}


export default fragments
```


## 获取设定内容

你可以在任何地方获取设定内容，获取方式有几种:

- 使用 [`useStorage`](/src/hooks/storage.ts) 钩子:

此功能来自 Plasmo, 你可以参考 [Plasmo 文档](https://docs.plasmo.com/framework/storage#react-hook-api) 以了解更多。

```tsx
function App(): JSX.Element {
    const [helloWorld] = useStorage<SettingSchema>("settings.helloWorld")
    return <></>
}
```

- 使用 [`getSettingStorage`](/src/utils/storage.ts) 函数:

```ts
const helloWorldSettings = getSettingStorage('settings.helloWorld')
```

> 此方式返回的数据本身包含设定结构，因此无需手动标注类型。

- 如果你在内容脚本中使用设定，则可以直接从 [`ContentContext`](/src/contexts/ContentContexts.ts) 获取设定:

```tsx
function ContentScript(): JSX.Element {
    const { settings } = useContext(ContentContext)
    const helloWorld = settings['settings.helloWorld']
    return <></>
}
```

## 进阶开发

你可以参考以下的源码以进行更进阶的设定开发:

- [现成的设定区块参考](/src/options/fragments/)
- [设定区块组件](/src/options/components/)
- [自定义Hooks](/src/hooks/)
- [自定义Context](/src/contexts/)
- [辅助函数](/src/utils/)
- [全局组件](/src/components)