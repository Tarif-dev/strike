import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
      // Include specific polyfills needed for Solana/Metaplex
      include: [
        "buffer",
        "crypto",
        "stream",
        "util",
        "process",
        "path",
        "assert",
        "os",
        "events",
        "fs",
      ],
      // overrides: { fs: "memfs" },
    }),
    // nodePolyfills({ overrides: { fs: "memfs" } }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Make sure to map browser-compatible versions
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      os: "os-browserify/browser",
      "node-fetch": "isomorphic-fetch",
      util: "util/",
      // Add custom polyfill for stream/promises
      "stream/promises": path.resolve(
        __dirname,
        "./src/lib/polyfills/stream-promises.js"
      ),
    },
  },
  // Define global variables for Node.js modules
  define: {
    global: "globalThis",
    "process.env": process.env,
  },

  // Configure optimizeDeps to include crypto-browserify
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Make sure these packages are not bundled
      external: [],
    },
    sourcemap: true,
  },
}));
