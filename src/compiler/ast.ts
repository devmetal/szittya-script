import { createReadStream } from "node:fs";

import toLines from "./toLines";

type Expression = { _type: "exp"; value: string };
type Literal = { _type: "lit"; value: string };
type Variable = { _type: "var"; value: string };
type Statement = { _type: "stm"; value: string };
type Operator = { _type: "op"; value: string };
type NodeType = Expression | Literal | Variable | Statement | Operator;

const _exp = (value: string): Expression => ({ _type: "exp", value });
const _lit = (value: string): Literal => ({ _type: "lit", value });
const _var = (value: string): Variable => ({ _type: "var", value });
const _stm = (value: string): Statement => ({ _type: "stm", value });
const _op = (value: string): Operator => ({ _type: "op", value });

const Lex: Readonly<{
  [key: string]: NodeType;
}> = Object.freeze({
  irgyad: _stm("output"),
  kérgyed: _stm("input"),
  légyen: _stm("declare"),
  ha: _stm("if"),
  akko: _stm("then"),
  elég: _stm("end"),
  dehanem: _stm("else"),
  az: _op("assign"),
});

const _lexGet = (key: string): NodeType | undefined => {
  return Lex[key];
};

type Node = {
  value: NodeType;
  children: Array<Node>;
};

const createNode = (parts: string[], parent: Node) => {
  if (!parts.length) {
    return parent;
  }

  const [symbol, ...rest] = parts;

  let nodeType: NodeType;

  if (symbol.match(/^[0-9]/)) {
    nodeType = _lit(symbol);
  } else if (symbol.startsWith('"')) {
    let value = symbol;

    while (!value.endsWith("")) {
      const next = rest.shift();
      if (!next) {
        // they forgot to close the string literal
        throw new Error(
          `Szittya error. Missing \" at the end of the string listeral: ${value}`
        );
      }
      value += next;
    }
    nodeType = _lit(value);
  } else if (symbol.startsWith("/")) {
    const subParts = [symbol.substring(1)]; // remove the leading /

    while (!subParts.at(-1)?.endsWith("/")) {
      const next = rest.shift();
      if (!next) {
        // they forgot to use the expression closing /
        throw new Error(
          `Szittya error. Missing / at the end of the expression: ${subParts.join(
            " "
          )}`
        );
      }
      subParts.push(next);
    }

    nodeType = _exp(subParts.join(" ").replace("/", ""));
  } else {
    const inLex = _lexGet(symbol);
    if (inLex) {
      nodeType = inLex;
    } else {
      nodeType = _var(symbol);
    }
  }

  const node: Node = {
    value: nodeType,
    children: [],
  };

  parent.children.push(node);
  createNode(rest, node);
};

const createAst = async (file: string): Promise<Array<Node | null>> => {
  const code = createReadStream(file);

  const nodes: Array<Node | null> = [];

  for await (const line of toLines(code)) {
    const parts = line
      .trim()
      .split(" ")
      .filter((part) => part.length);

    if (!parts.length) {
      continue;
    }

    const ln: Node = {
      value: _stm("line"),
      children: [],
    };

    createNode(parts, ln);
    nodes.push(ln);
  }

  return nodes;
};

export default createAst;
