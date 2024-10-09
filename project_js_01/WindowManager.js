class WindowManager {
    constructor() {
        this.windows = [];
        this.winShapeChangeCallback = null;
        this.winChangeCallback = null;
    }

    // Initialize the WindowManager with custom metadata
    init(metaData) {
        this.windows.push({ shape: { x: 100, y: 100, w: 200, h: 200 }, meta: metaData });
        if (this.winChangeCallback) {
            this.winChangeCallback();
        }
    }

    // Set the callback for window shape changes
    setWinShapeChangeCallback(callback) {
        this.winShapeChangeCallback = callback;
    }

    // Set the callback for window changes (i.e., adding/removing windows)
    setWinChangeCallback(callback) {
        this.winChangeCallback = callback;
    }

    // Return the list of managed windows
    getWindows() {
        return this.windows;
    }

    // Simulate window update logic here
    update() {
        // Simulate some changes in window configuration
    }
}

// Create a global instance of WindowManager so it can be used in script.js
window.windowManager = new WindowManager();
