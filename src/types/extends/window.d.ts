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
    }

}

export {}