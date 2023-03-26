import { pasteHtmlAtCaret } from './utils.js';

export class Math {
    constructor(window, document, caret, texInput) {
        this.window = window;
        this.document = document;

        this.caret = caret;

        this.eq = 0;
        this.eqs = [];
        this.sel = null;
        this.prefix = '$$';

        this.texInput = texInput;
        this.mode = 'add';
    }

    add(tex) {
        if(tex == '') {
            this.caret.setCaret();
            return;
        }
        //Html for tex div
        this.texHtml = '<div contenteditable="false" class="tex active" id="' + this.eq + '">'+ this.prefix + tex + this.prefix +'</div>';
    
        //store raw latex in eqs array
        this.eqs.push(tex)
    
        this.caret.setCaret();
        pasteHtmlAtCaret(this.texHtml, this.window, this.document);
    
        const texDiv = this.document.getElementById(this.eq);
    
        //render latex
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, toString(this.eq)]);
    
        //select click event
        texDiv.onclick = (event) => {
            this.select(texDiv);
            event.stopPropagation();
        }
    
        this.texInput.value = '';
        this.eq += 1;
    }

    update(tex) {
        if(tex == '') {
            try {this.document.getElementById(this.sel).remove()}catch{}
            try {this.caret.setCaret()} catch {
                this.caret.endOffset = 0;
                this.caret.endContainer = this.document.getElementById('editor');
                this.caret.setCaret();
            }

            this.sel = null;
            this.mode = 'add';
            return;
        }
    
        if(this.sel == null) {
            this.editInput.value = '';
            this.caret.setCaret();
            this.mode = 'add';
            return;
        }
    
        this.document.getElementById(this.sel).innerHTML = this.prefix + tex + this.prefix;
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.sel]);
        this.eqs[this.sel] = tex;
    
        this.cancel();
    }

    select(div) {
        if(this.sel != null) {
            this.document.getElementById(this.sel).classList.remove('selected');
        }
        
        this.sel = div.id;
        this.mode = 'edit';

        div.classList.add('selected');
        this.texInput.value = this.eqs[this.sel];
        this.texInput.focus();
    }

    cancel() {
        if(this.sel == null) {
            return;
        }
        this.document.getElementById(this.sel).classList.remove('selected');
        this.sel = null;
        this.texInput.value = '';
        this.mode = 'add';
    
        this.caret.setCaret();
    }
}