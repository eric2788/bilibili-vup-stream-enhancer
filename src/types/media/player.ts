
import type { EventType, VideoInfo, StreamParseEvent, EventHandler } from "~players"

export abstract class StreamPlayer {

    protected readonly eventHandlers: Map<EventType, Set<EventHandler<EventType>>> = new Map()

    abstract get internalPlayer(): any

    abstract get isSupported(): boolean

    abstract get videoInfo(): VideoInfo

    abstract play(url: string, media?: HTMLMediaElement): Promise<void>

    abstract stopAndDestroy(): void

    on<E extends EventType>(event: E, handler: EventHandler<E>): void {
        const handlers = this.eventHandlers.get(event)
        if (!handlers) {
            this.eventHandlers.set(event, new Set([handler]))
            return
        }
        handlers.add(handler)
    }

    off<E extends EventType>(event: E, handler: EventHandler<E>): void {
        const handlers = this.eventHandlers.get(event)
        if (handlers) handlers.delete(handler)
    }

    protected emit<E extends EventType>(event: E, payload: StreamParseEvent[E]): void {
        const handlers = this.eventHandlers.get(event)
        for (const handler of (handlers || [])) {
            handler(payload)
        }
    }

    protected clearHandlers(): void {
        this.eventHandlers.clear()
    }

}