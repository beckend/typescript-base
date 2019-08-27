"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = exports.returnArray = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const returnArray = (x) => (Array.isArray(x) ? x : []);
exports.returnArray = returnArray;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toArray = (x) => (Array.isArray(x) ? x : [x]);
exports.toArray = toArray;
