import { caret, pageHandler } from "./globals.js";
import { Latex } from "./latex.js";
import { pasteHtmlAtCaret } from "./utils.js";

const upper = document.querySelector('.upper');
const mathSpan = document.querySelector('#mathSpan');
const texInput = document.querySelector('#texInput');
const addBtn = document.querySelector('#addBtn');
const cancelBtn = document.querySelector('#cancelBtn');
let mathLabel = document.querySelector('.math-label');
const mathLabelHTML = '<div class="math-label">Add LaTeX (Ctrl + E)</div>';
const placeHolderHTML = '<div class="math-placeholder" contenteditable="false"></div>';
const MQ = MathQuill.getInterface(2);

let mathInput = null;
let mathEditorState = false;
let mathInputMode = 'add';
let selected = null;

export function openMathEditor() {
    if(!mathEditorState) {
        if(mathInputMode == 'add') addPlaceHolder(); // Placeholder for new .tex div

        mathLabel.innerHTML = '';
        mathInput = MQ.MathField(mathSpan);
        mathInput.focus();
        texInput.classList.add('math-active');
        mathEditorState = true;
    }
}

export function closeMathEditor(set) {
    if(mathEditorState) {
        removePlaceHolder(); // Remove .tex div placeholder

        mathSpan.innerHTML = mathLabelHTML;
        mathLabel = document.querySelector('.math-label');

        mathInput = null;
        texInput.classList.remove('math-active');
        texInput.value = '';

        if(!set) caret.setCaret();

        mathEditorState = false;
        editModeOff();
    }
}

export function insertMath() {
    removePlaceHolder(); // Remove .tex div placeholder
    if(texInput.value == '') {
        closeMathEditor(false);
        return;
    }

    const latex = new Latex(texInput.value, pageHandler.active.eq, pageHandler.active.prefix);
    caret.setCaret();
    latex.add();

    pageHandler.active.addMath(latex);
    closeMathEditor(true);
}

export function updateMath() {
    if(texInput.value == '') {
        try{selected.div.remove()}catch{}
    } else {
        selected.edit(texInput.value);
    }

    closeMathEditor(false);
    unSelectMath();
}

export function selectMath(e, latex) {
    e.stopPropagation();
    document.querySelectorAll('.selected').forEach(elem => elem.classList.remove('selected'));
    
    selected = latex;
    selected.div.classList.add('selected');

    if(mathEditorState) closeMathEditor(false);
    editModeOn();
    openMathEditor();
    mathInput.latex(latex.tex);
    texInput.value = latex.tex;
}

export function unSelectMath() {
    document.querySelectorAll('.selected').forEach(elem => elem.classList.remove('selected'));
    selected = null;
}

function editModeOn() {
    mathInputMode = 'edit';
    addBtn.value = 'Edit';
    cancelBtn.classList.remove('hide');
}

function editModeOff() {
    mathInputMode = 'add';
    addBtn.value = 'Add';
    cancelBtn.classList.add('hide');
}

function addPlaceHolder() {
    caret.setCaret();
    pasteHtmlAtCaret(placeHolderHTML);
}

function removePlaceHolder() {
    document.querySelectorAll('.math-placeholder').forEach(elem => elem.remove());
}

export function mathEditorEventListeners() {
    mathSpan.addEventListener('click', () => openMathEditor());

    // Get raw latex value from mathInput to texInput, and vice-versa
    mathSpan.addEventListener('keyup', () => texInput.value = mathInput.latex());
    texInput.addEventListener('keyup', () => mathInput.latex(texInput.value));

    mathSpan.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                if (mathInputMode == 'add') insertMath();
                if (mathInputMode == 'edit') updateMath();
                break;
            case 'Escape':
                closeMathEditor(false);
                unSelectMath();
                break;
        }
    });

    addBtn.addEventListener('click', () => {
        if (mathInputMode == 'add') insertMath();
        if (mathInputMode == 'edit') updateMath();
    });

    cancelBtn.addEventListener('click', () => {
        closeMathEditor(false);
        unSelectMath();
    });
}

