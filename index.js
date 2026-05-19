'use strict';

const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';

const DEFAULTS = {
  includeTimestamp: true,
  timeFormat: '24h',
};

const LEVEL_STYLES = {
  INFO: GREEN,
  WARN: YELLOW,
  ERROR: RED,
};

let nativeLog;
let nativeWarn;
let nativeError;
let patched = false;
let currentConfig = { ...DEFAULTS };

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime24h(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatTime12h(date) {
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${pad(hours)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${ampm}`;
}

function formatTimestamp(date, timeFormat) {
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const timePart =
    timeFormat === '12h' ? formatTime12h(date) : formatTime24h(date);
  return `${datePart} ${timePart}`;
}

function mergeConfig(config) {
  const merged = { ...DEFAULTS, ...config };
  if (merged.timeFormat !== '24h' && merged.timeFormat !== '12h') {
    merged.timeFormat = '24h';
  }
  return merged;
}

function formatPrefix(level, config) {
  let prefix = '';

  if (config.includeTimestamp) {
    const timestamp = formatTimestamp(new Date(), config.timeFormat);
    prefix += `${CYAN}[${timestamp}]${RESET} `;
  }

  const color = LEVEL_STYLES[level];
  prefix += `${color}[${level}]${RESET} `;

  return prefix;
}

function initLoghue(config = {}) {
  currentConfig = mergeConfig(config);

  if (!patched) {
    nativeLog = console.log.bind(console);
    nativeWarn = console.warn.bind(console);
    nativeError = console.error.bind(console);

    console.log = (...args) => {
      nativeLog(formatPrefix('INFO', currentConfig), ...args);
    };

    console.warn = (...args) => {
      nativeWarn(formatPrefix('WARN', currentConfig), ...args);
    };

    console.error = (...args) => {
      nativeError(formatPrefix('ERROR', currentConfig), ...args);
    };

    patched = true;
  }
}

module.exports = { initLoghue };
