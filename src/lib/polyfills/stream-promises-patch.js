// This is a temporary patch for fixing stream/promises in browser environments
// It specifically handles what Irys and other packages need
import { Readable, Writable } from "stream-browserify";

// Simple implementation of pipeline for browser environments
export function pipeline(source, ...destinations) {
  return new Promise((resolve, reject) => {
    let current = source;

    const handleError = (err) => {
      source.removeListener("error", handleError);
      destinations.forEach((dest) => dest.removeListener("error", handleError));
      reject(err);
    };

    source.on("error", handleError);
    destinations.forEach((dest) => {
      dest.on("error", handleError);
      current.pipe(dest);
      current = dest;
    });

    const final = destinations[destinations.length - 1];
    final.on("finish", resolve);
  });
}

// Simple implementation of finished for browser environments
export function finished(stream) {
  return new Promise((resolve, reject) => {
    stream.on("end", resolve);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// Export the full module
const streamPromises = {
  pipeline,
  finished,
};

// Add this to the global scope
if (typeof window !== "undefined") {
  if (!window.stream) window.stream = {};
  window.stream.promises = streamPromises;
}

export default streamPromises;
