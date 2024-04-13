declare global {

  interface RequestPipOptions {
    width: number;
    height: number;
  }

  interface DocumentPictureInPicture {
    // Instance properties
    window: Window; // Returns a Window instance representing the browsing context inside the Picture-in-Picture window.

    // Instance methods
    requestWindow(options?: RequestPipOptions): Promise<Window>; // Opens the Picture-in-Picture window for the current main browsing context.

    // Events
    onenter: Event; // Fired when the Picture-in-Picture window is successfully opened.
  }

  interface Window {
    documentPictureInPicture?: DocumentPictureInPicture
    flvjs?: any
    Hls?: any
  }

  interface WebSocket {
    onInterceptMessage: (msg: MessageEvent, realOnMessage: (msg: MessageEvent) => void) => void
    _send: (data: any) => void
  }

  interface HTMLIFrameElement {
    mozallowfullscreen: boolean
    msallowfullscreen: boolean
    oallowfullscreen: boolean
    webkitallowfullscreen: boolean
  }

  interface FileSystemDirectoryHandle {
    [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemHandle>;
    remove(options?: { recursive: boolean }): Promise<void>;
  }

  interface HTMLMediaElement{
    captureStream(): MediaStream;
  }

}

export { }