export class Caret {
    constructor(elem, window) {
        this.endContainer = elem;
        this.endOffset = 0;
        this.window = window;
    }

    setCaret() {
        this.window.getSelection().collapse(this.endContainer, this.endOffset);
    }

    getCaret() {
        this.endContainer = window.getSelection().getRangeAt(0).endContainer;
        this.endOffset = window.getSelection().getRangeAt(0).endOffset;
    }
}

export function pasteHtmlAtCaret(html, window, document) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

