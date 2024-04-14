import boostWebSocketHook from './boostWebsocketHook'
import getBLiveCachedData from './getBLiveCachedData'
import getWindowVariable from './getWindowVariable'
import invokeLivePlayer from "./p2pLivePlayer"

export interface InjectableFunction<T extends InjectableFunctionType> {
    name: T
    args: InjectableFunctionParameters<T>
}

export type InjectableFunctions = typeof functions

export type InjectableFunctionType = keyof InjectableFunctions

export type InjectableFunctionParameters<T extends InjectableFunctionType> = Parameters<InjectableFunctions[T]>

export type InjectableFunctionReturnType<T extends InjectableFunctionType> = ReturnType<InjectableFunctions[T]>

const functions = {
    getWindowVariable,
    getBLiveCachedData,
    boostWebSocketHook,
    invokeLivePlayer
}


export default functions

