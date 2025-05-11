import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as buffer from "buffer";
import * as streamPromises from "./lib/polyfills/stream-promises";

// Declare the 'stream' property on Window interface
declare global {
  interface Window {
    stream: any;
  }
}

// Set up global polyfills for Node.js modules
window.Buffer = buffer.Buffer;

// Make stream/promises available globally
if (!window.process) {
  window.process = { env: {} } as any;
}

// Add stream promises to global
if (!window.stream) {
  window.stream = {};
}
window.stream.promises = streamPromises;

// Create React root and render the app
createRoot(document.getElementById("root")!).render(<App />);
