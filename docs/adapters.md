# 适配器

用于连接或转换不同的B站WS数据源以供内容脚本使用。

## 适配器列表

目前只有 `WebSocket` 和 `Dom` 两种适配器。

WebSocket 是目前最常用的适配器，它直接挂钩网页上的 WebSocket 客户端，以获取B站WS数据。

Dom 适配器则是通过解析网页上的DOM元素，以获取特定数据。

WebSocket 相比Dom适配器更加稳定和更加泛用。但万一 WebSocket 无法使用，Dom 适配器则是一个备选方案。

如果你需要新增一个适配器，你需要留意以下内容:

- 你需要用到 [`utils/messaging.ts`](/src/utils/messaging.ts) 中的 `sendBLiveMessage` 方法，以发送数据到内容脚本。

- 新增方式可以在 `adapters/` 目录下创建文件，然后在 `adapters/index.ts` 中进行注册。

- 基于目前以WS为主的情况，你需要发送以 WS 结构为準的数据。
