# Szittya Script

## Work in progress

This is a very experimental, in progress new script language called Szittya.

## Features

- [x] AST Generation
- [ ] Js Output
- [ ] Run Compiled code with node
- [ ] Low level output
- [ ] Debugger

## Example code

This code can be changed in the future.

```
irgyad "Hello"

légyen foo
foo az 5

légyen bar
bar az 5

légyen sum
sum az /foo + bar/

irgyad sum

légyen name
kérgyed name
irgyad name

írgyad "Hány éves vagy?"
légyen age
kérgyed age

ha /age nagyobbé 18/
akko
    írgyad "Nagykorú"
elég
dehanem
    írgyad "Kicsike"
elég

```

## How to play with it

```bash
git clone <url>
cd <folder>
npm i
npm link
szittya -f <.szittya file path> -d
# This will be generate an ast file as output.
```

## Contribute and development

```bash
git clone <url>
cd <folder>
npm i
```

## Building the compiler

```bash
npm run build
```

## Testing with the provided .szittya

```bash
npm run start:example
```

## Testing with custom .szittya file

```bash
npm start -- -f <path> -d
```

## Current flags

- -f --file: Input .szittya file
- -d --debug: This will be generate the ast

## Urgent missing features:

- Unit testing
- AST Normalization (expressions)
- Produce js output
