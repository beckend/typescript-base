"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = exports.returnArray = void 0;
exports.returnArray = (x) => (Array.isArray(x) ? x : []);
exports.toArray = (x) => (Array.isArray(x) ? x : [x]);
