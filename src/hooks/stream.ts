
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { ChannelType } from "~background/forwards";
import type { ForwardBody } from "~background/forwards/stream-content";
import type { VideoInfo } from '~players/index';
import { deserializeStringToBlob, serializeBlobAsString, splitBlob } from "~utils/binary";
import { useForwarder } from "./forwarder";


export type StreamResult = {
    duration: number
    videoInfo: VideoInfo
    filename: string
    content: Blob[]
}

export type StreamContent = {
    id: string
    duration: number
    videoInfo: VideoInfo
    filename: string
    blob: Blob | Blob[]
}

export function useShardSender(channel: ChannelType) {
    const forwarder = useForwarder('stream-content', channel)

    const waitForReady = useCallback(async (id: string) => {
        return new Promise<void>((res, rej) => {
            const remove = forwarder.addHandler((body: ForwardBody) => {
                if (body.stage === 'ready' && body.id === id) {
                    remove()
                    res()
                }
            })
            setTimeout(() => rej(new Error('timeout')), 1000 * 60) // 1 minute
        })
    }, [channel])

    return async (channel: ChannelType, body: StreamContent) => {
        console.debug('splitting chunks...')
        const chunks = Array.isArray(body.blob) ? body.blob : splitBlob(body.blob, 1024 * 1024) // 1MB
        console.debug('splited to chunks: ', chunks.length)
        console.debug('their average size: ', chunks.reduce((a, b) => a + b.size, 0) / chunks.length)
        try {
            console.debug('waiting for ready signal....')
            await waitForReady(body.id)
            console.debug('sending init...')
            forwarder.sendForward(channel, {
                stage: 'init',
                id: body.id,
                duration: body.duration,
                videoInfo: body.videoInfo,
                filename: body.filename,
                totalChunks: chunks.length
            })
            console.debug('sending chunks...')
            for (let i = 0; i < chunks.length; i++) {
                forwarder.sendForward(channel, {
                    stage: 'data',
                    id: body.id,
                    order: i,
                    content: await serializeBlobAsString(chunks[i])
                })
            }
            console.debug('sending end...')
            forwarder.sendForward(channel, {
                stage: 'end',
                id: body.id,
            })
        } catch (error: Error | any) {
            console.error('error: ', error)
            forwarder.sendForward(channel, {
                stage: 'error',
                id: body.id,
                message: error?.message ?? error
            })
            throw error
        }
    }
}


type ChunkInfo = {
    chunk: Blob
    order: number
}


export type ReceiveInfo = {
    info: StreamResult | null
    progress: number
    error: Error
    ready: (channel: ChannelType) => void
}

export function useShardReceiver(id: string, channel: ChannelType): ReceiveInfo {

    const forwarder = useForwarder('stream-content', channel)
    const [info, setInfo] = useState<StreamResult>()
    const chunks = useRef<ChunkInfo[]>([])
    const [total, setTotal] = useState(0)
    const [realProgress, setProgress] = useState(0)
    const progress = useDeferredValue(realProgress)
    const [error, setError] = useState<Error>()

    useEffect(() => {

        console.debug('listening to stream content...')
        forwarder.addHandler((body) => {
            if (body.id !== id) return
            console.debug('received stage: ', body.stage)
            if (body.stage === 'init') {
                setInfo(() => ({
                    duration: body.duration,
                    videoInfo: body.videoInfo,
                    filename: body.filename,
                    content: []
                }))
                setTotal(body.totalChunks)
            } else if (body.stage === 'data') {
                console.debug('received chunks: ', body.content.length, ' order: ', body.order)
                const blob = deserializeStringToBlob(body.content)
                chunks.current.push({
                    chunk: blob,
                    order: body.order
                })
                setProgress((prev) => prev + 1)
                console.debug('fetched chunk: ', body.order)
            } else if (body.stage === 'end') {
                setInfo((prev) => ({
                    ...prev,
                    content: chunks.current
                        .sort((a, b) => a.order - b.order)
                        .map((c) => c.chunk)
                        .flat()
                }))
            } else if (body.stage === 'error') {
                setError(new Error(body.message))
            }
        })

    }, [channel])

    const ready = useCallback((channel: ChannelType) => {
        console.debug('send ready signal...')
        forwarder.sendForward(channel, {
            stage: 'ready',
            id
        }, { url: '*://live.bilibili.com/*' })
    }, [])

    const streamInfo = useMemo(() => {
        console.debug(
            'progress=',
            progress,
            '/',
            total,
            '*100',
            '=',
            progress / total * 100
        )
        return {
            info: progress < total ? null : info, // null while in progress
            progress: progress / total * 100,
            error,
            ready,
        }
    }, [info, progress, total, error, ready])

    return streamInfo
}