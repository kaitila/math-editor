import { PageHandler } from "./page.js";
import { Caret } from "./utils.js";

export const caret = new Caret;
export const textEditor = document.querySelector('#editor');
export const pageHandler = new PageHandler(textEditor);