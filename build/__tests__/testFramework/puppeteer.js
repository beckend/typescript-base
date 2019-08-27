"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("querystring");
class Puppeteer {
    constructor({ 
    // defaults to storybook example
    baseImageURL = 'http://localhost:9009/iframe.html' } = {}) {
        this.getImageURL = ({ baseImageURL, query, }) => `${baseImageURL || this.baseImageURL}?${qs.stringify(query)}`;
        this.baseImageURL = baseImageURL;
    }
}
exports.Puppeteer = Puppeteer;
