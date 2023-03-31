import { Latex } from "./latex.js";
import { Caret, openOptions, closeOptions } from "./utils.js";

class Page {
    constructor(title, prefix) {
        this.title = title;
        this.content = '';
        this.div = document.createElement('div');
        this.div.classList.add('page-card');
        this.div.innerHTML = `<div class="text-container">${this.title}</div><div class="ellipsis"><i class="fa-solid fa-ellipsis fa-rotate-90"></i></div>`;  

        this.sel = null;

        this.texInput = document.getElementById('texInput');
        this.inputMode = 'add';

        this.eqs = [];
        this.eq = 0;
        this.caret = new Caret();
        this.prefix = prefix;
    }
    
    addLatex(tex) {
        const latex = new Latex(tex, this.eq, this.prefix);
        this.caret.setCaret();
        latex.add();
        latex.div.addEventListener('click', (e) => this.select(e, latex));
        this.eqs.push(latex);
        this.eq += 1;
    }
    
    select(e, latex) {
        if(this.sel != null) {
            this.sel.div.classList.remove('selected');
        }
        
        this.sel = latex;
        latex.div.classList.add('selected');
        e.stopPropagation();
        this.inputMode = 'edit';
        this.texInput.value = latex.tex;
        this.texInput.focus();
    }

    update(tex) {
        if(tex == '') {
            try{this.sel.div.remove()}catch{}
            this.sel = null;
            this.cancel();
            return
        }

        this.sel.edit(tex);
        this.cancel();
    }

    cancel() {
        try{this.sel.div.classList.remove('selected')}catch{}
        this.caret.setCaret();
        this.texInput.value = '';
        this.inputMode = 'add';
    }

    setTitle(title) {
        this.title = title;
        this.div.firstChild.innerHTML = title;
    }
}

export class PageHandler {
    constructor(editor) {
        this.editor = editor;
        this.pageOpts = document.querySelector('.page-options');
        this.pages = document.getElementById('pages');
        this.pageList = [];
        this.index = null; //index of active page
        this.active = null; //active page object
        this.edited = null; //currently edited page
        this.prefix = '$$';
    }

    addPage(title) {
        const page = new Page(title, '$$');
        pages.insertBefore(page.div, document.getElementById('addPage'));
        this.pageList.push(page);
        page.div.addEventListener('click', () => this.load(page));
        page.div.lastChild.addEventListener('click', (e) => {
            openOptions(this, page);
            e.stopPropagation();
        });
        this.load(page);
    }

    deletePage(page) {
        if(this.pageList.indexOf(page) > -1) {
            this.pageList.splice(this.pageList.indexOf(page), 1);
            page.div.remove();
        }
    }

    load(page) {
        this.pageList.forEach(elem => elem.div.classList.remove('active-page'));
        page.div.classList.add('active-page');
        page.prefix = this.prefix;

        this.index = this.pageList.indexOf(page);
        this.active = page;

        this.editor.innerHTML = page.content;
        page.eqs.forEach(latex => {
                latex.render();
                try{
                    latex.div.addEventListener('click', (e) => page.select(e, latex));
                }catch{
                    console.log(`Unable to set event listener: ${latex.id} doesn't exist.`);
                }
        });
    }   

    save() {
        //Create a clone of #editor, replace .tex.innerHTML with LaTeX, get #editor.innerHTML.
        let editorClone = this.editor.cloneNode(true);
        editorClone.querySelectorAll('.tex').forEach(elem => {
            elem.innerHTML = this.active.eqs[elem.id].prefix + this.active.eqs[elem.id].tex + this.active.eqs[elem.id].prefix;
            elem.classList.remove('active');
            elem.classList.remove('selected');
        });

        this.active.content = editorClone.innerHTML;
    }

    setPrefix(prefix) {
        this.prefix = prefix;
        this.active.prefix = prefix;
    }
}

