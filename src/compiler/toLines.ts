import { type ReadStream } from "fs";

async function* toLines(chunkIterable: ReadStream) {
  let previous = "";
  for await (const chunk of chunkIterable) {
    let startSearch = previous.length;
    previous += chunk;
    while (true) {
      const eolIndex = previous.indexOf("\n", startSearch);
      if (eolIndex < 0) break;
      const line = previous.slice(0, eolIndex + 1);
      yield line;
      previous = previous.slice(eolIndex + 1);
      startSearch = 0;
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

export default toLines;
