#!/usr/bin/env node

import { parseArgs } from "node:util";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import createAst from "./compiler/ast";

type Arguments = {
  file: string;
  debug: boolean;
};

const getArguments = (): Arguments => {
  const [, , ...args] = process.argv;
  const {
    values: { file, debug },
  } = parseArgs({
    args,
    options: {
      file: {
        type: "string",
        short: "f",
      },
      debug: {
        type: "boolean",
        short: "d",
        default: false,
      },
    },
  });

  if (!file) {
    throw "Missing --file/-f flag";
  }

  return {
    file: path.resolve(process.cwd(), file),
    debug: debug ?? false,
  };
};

const main = async (): Promise<void> => {
  const { file, debug } = getArguments();
  const ast = await createAst(file);

  if (debug === true) {
    await writeFile(
      path.resolve(process.cwd(), "debug.ast.json"),
      JSON.stringify(ast, null, 2)
    );
  }
};

main().catch((err) => {
  console.error(err);
});
