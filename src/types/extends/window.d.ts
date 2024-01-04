declare global {
    
    interface DocumentPictureInPicture {
      // Instance properties
      window: Window; // Returns a Window instance representing the browsing context inside the Picture-in-Picture window.
  
      // Instance methods
      requestWindow(): Promise<Window>; // Opens the Picture-in-Picture window for the current main browsing context.
  
      // Events
      onenter: Event; // Fired when the Picture-in-Picture window is successfully opened.
    }
  
    interface Window {
      documentPictureInPicture?: DocumentPictureInPicture
    }

}

export {}