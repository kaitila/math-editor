import { pasteHtmlAtCaret } from "./utils.js";

export class Latex {
    constructor(tex, id, prefix) {
        this.tex = tex;
        this.id = id;
        this.prefix = prefix;

        this.html = `<div contenteditable="false" class="tex active" id="${id}">${prefix}${tex}${prefix}</div>`;
    }

    render() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, toString(this.id)]);
        this.div = document.getElementById(this.id);
    }

    add() {
        pasteHtmlAtCaret(this.html);
        this.render();
    }

    edit(tex) {
        this.tex = tex;
        this.div.innerHTML = this.prefix + tex + this.prefix;
        this.render();
    }
}