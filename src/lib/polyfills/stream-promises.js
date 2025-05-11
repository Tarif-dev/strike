// This file provides polyfills for stream/promises for browser compatibility
// Used by Irys/Metaplex packages

import { Readable, Writable } from "stream-browserify";

// Simple pipeline implementation for browser
export function pipeline(source, ...destinations) {
  return new Promise((resolve, reject) => {
    let current = source;

    const handleError = (err) => {
      // Cleanup listeners
      source.removeListener("error", handleError);
      destinations.forEach((dest) => {
        dest.removeListener("error", handleError);
      });
      reject(err);
    };

    // Handle errors
    source.on("error", handleError);
    destinations.forEach((dest) => {
      dest.on("error", handleError);
      current.pipe(dest);
      current = dest;
    });

    // Resolve when the final destination is finished
    const final = destinations[destinations.length - 1];
    final.on("finish", () => {
      resolve();
    });
  });
}

// Mock for finished - simplified version
export function finished(stream) {
  return new Promise((resolve, reject) => {
    stream.on("end", resolve);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

export default {
  pipeline,
  finished,
};
