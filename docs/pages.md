# 新增页面

> 本扩展基于 [Plasmo Extension Page](https://docs.plasmo.com/framework/ext-pages) 进行页面渲染。

如要新增页面，只需要到以下地方新增即可：

```
src/
    tabs/ <- 扩展页面
```

## 创建一个新的扩展页面

在 `src/tabs/` 目录下新增一个新的扩展页面，例如 `src/tabs/hello-world.tsx`。

```tsx

import '~style.css' // 汇入 tailwindcss 样式以在页面中使用

function App(): JSX.Element {
    return (
        <div>Hello, World!</div>
    )
}

export default App
```

完成后，扩展在建置时会自动生成 hello-world.html 文件，且会自动添加到扩展的 `manifest.json` 中。

## 跳转到扩展页面

如要在其他位置跳转到扩展页面，有以下两种方式:

- 使用 `open-tab` messager 指令，进行跳转:

范例如下:

```tsx
function HelloWorldButton(): JSX.Element {
    const openPage = () => sendMessager('open-tab', { tab: 'hello-world' })
    return <button onClick={openPage}>click me to open!</button>
}

export default HelloWorldButton
```

- 使用 `chrome.tabs.create` 和 `chrome.runtime.getURL` API，进行跳转:

范例如下:

```tsx
function HelloWorldButton(): JSX.Element {
    const openPage = () => chrome.tabs.create({ url: chrome.runtime.getURL('/tabs/hello-world.html') })
    return <button onClick={openPage}>click me to open!</button>
}
export default HelloWorldButton
```

> 使用 chrome API 方式可能需要考虑到一些API无法在内容脚本中使用的问题，因此建议使用 messager 方式进行跳转。

有关 messager 的更多信息，你可以参阅 [`docs/background.md`](./background.md) 文档中有关 messager 的信息。


## 进阶开发

你可以参考以下的源码以进行更进阶页面开发:

- [现成的扩展页面参考](/src/tabs/)
- [自定义Hooks](/src/hooks/)
- [辅助函数](/src/utils/)
- [全局组件](/src/components)