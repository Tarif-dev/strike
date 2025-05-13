// This is a custom Vite plugin to handle stream/promises and other Node.js modules
// that are needed by Metaplex/Solana packages in the browser environment

export function streamPromisesPlugin() {
  return {
    name: "vite-plugin-stream-promises",
    resolveId(id) {
      // Intercept specific problematic imports
      if (id === "stream/promises") {
        // Return a custom ID for our polyfill
        return "virtual:stream-promises";
      }
      return null;
    },
    load(id) {
      // When our custom ID is requested, provide the polyfill code
      if (id === "virtual:stream-promises") {
        return `
          import streamPromises from '/src/lib/polyfills/stream-promises-patch.js';
          export const { pipeline, finished } = streamPromises;
          export default streamPromises;
        `;
      }
      return null;
    },
  };
}
