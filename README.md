# loghue

A lightweight, zero-dependency npm package that patches the global `console` with colored log levels and timestamps.

## Features

- Patches `console.log`, `console.warn`, and `console.error` globally
- Native ANSI colors — no Chalk, Kleur, or other dependencies
- Cyan timestamps and colored level tags: `[INFO]`, `[WARN]`, `[ERROR]`
- Optional timestamp and 12-hour / 24-hour time format
- Preserves Node’s built-in formatting for objects and multiple arguments

## Installation

```bash
npm install loghue
```

For local development in this repo:

```bash
npm link
```

## Quick Start

Call `initLoghue()` once at application startup. Every `console` call after that gets a formatted prefix.

```js
const { initLoghue } = require('loghue');

initLoghue();

console.log('Server started on port 3000');
console.warn('Memory usage is high');
console.error('Failed to connect to database');
```

Example output (colors shown in supported terminals):

```text
[2026-05-19 14:30:45] [INFO] Server started on port 3000
[2026-05-19 14:30:45] [WARN] Memory usage is high
[2026-05-19 14:30:45] [ERROR] Failed to connect to database
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeTimestamp` | `boolean` | `true` | Prefix each line with a cyan timestamp |
| `timeFormat` | `'24h'` \| `'12h'` | `'24h'` | Clock format for the timestamp |

### Turn off timestamps

```js
const { initLoghue } = require('loghue');

initLoghue({ includeTimestamp: false });

console.log('No timestamp, still colored [INFO] tag');
```

### Use 12-hour time

```js
initLoghue({ timeFormat: '12h' });

console.log('Timestamp uses AM/PM');
```

### Combine options

```js
initLoghue({
  includeTimestamp: true,
  timeFormat: '12h',
});
```

## License

MIT
