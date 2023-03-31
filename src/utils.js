export class Caret {
    constructor() {
        this.endContainer = document.getElementById('editor');
        this.endOffset = 0;
    }

    setCaret() {
        try{
            window.getSelection().collapse(this.endContainer, this.endOffset)
        }catch{
            window.getSelection().collapse(document.getElementById('editor'), 0);
        }
    }

    getCaret() {
        this.endContainer = window.getSelection().getRangeAt(0).endContainer;
        this.endOffset = window.getSelection().getRangeAt(0).endOffset;
    }
}

export function pasteHtmlAtCaret(html) {
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

export function openOptions(pageHandler, page) {
    const inputField = document.getElementById('titleEditInput');
    document.querySelector('.shader').style.display = 'block';
    document.querySelector('.page-options').style.display = 'flex';
    inputField.value = page.title;
    inputField.focus();
    pageHandler.edited = page;
}

export function closeOptions() {
    document.querySelector('.page-options').style.display = 'none';
    document.querySelector('.shader').style.display = 'none';
}