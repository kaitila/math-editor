import { caret, pageHandler } from "./globals.js";
import { closeMathEditor, mathEditorEventListeners, openMathEditor, unSelectMath } from "./mathEditor.js";
import { PageHandler } from "./page.js";
import { closeOptions, hidePlaceholder } from "./utils.js";

//get input field elements
const texInput = document.getElementById('texInput');
const editor = document.getElementById('editor');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addPage = document.getElementById('addPage');
const mathSpan = document.getElementById('mathSpan');

//const pageHandler = new PageHandler(editor);
window.onload = () => {
    pageHandler.addPage('Untitled');
    mathEditorEventListeners();
};

//radio buttons
document.querySelectorAll('.prefix').forEach(elem => {
    elem.addEventListener('click', () => pageHandler.setPrefix(elem.value));
});

//-------------------------------------------------------------------

document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key == 'e') {
        e.preventDefault();
        openMathEditor();
    }
});

editor.addEventListener('keyup', () => {
    caret.getCaret();
    pageHandler.save();
});

editor.addEventListener('click', () => {
    caret.getCaret();
    closeMathEditor(false);
    unSelectMath();
    pageHandler.save();
});

// Highlight equation divs
editor.addEventListener('focus', () => {
    document.querySelectorAll('.tex').forEach(elem => {
        elem.classList.add('active');
        pageHandler.save();
    });
});

editor.addEventListener('blur', () => {
    document.querySelectorAll('.active').forEach(elem => {
        elem.classList.remove('active');
    });
});

addPage.addEventListener('click', () => {
    openPageCreate();
});

const createPage = document.getElementById('createPage');
const titleInput = document.getElementById('titleInput');
const shader = document.querySelector('.shader');
const closeInput = document.getElementById('closeInput');
const createPageWindow = document.querySelector('.create-page');
const closeOpts = document.getElementById('closePageOptions');
const titleEditBtn = document.getElementById('editTitle');
const titleEditInput = document.getElementById('titleEditInput');

createPage.addEventListener('click', () => {
    pageHandler.addPage(titleInput.value);
    closePageCreate();
});

titleInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter') {
        e.preventDefault();
        pageHandler.addPage(titleInput.value);
        closePageCreate();
    }
});

shader.addEventListener('click', () => {
    closePageCreate();
    closeOptions();
});

closeInput.addEventListener('click', () => closePageCreate());
closeOpts.addEventListener('click', () => closeOptions());
titleEditBtn.addEventListener('click', () => {
    pageHandler.edited.setTitle(titleEditInput.value);
    closeOptions();
});

titleEditInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter') {
        e.preventDefault();
        pageHandler.edited.setTitle(titleEditInput.value);
        closeOptions();
    }
})

function openPageCreate() {
    createPageWindow.style.display = 'flex';
    shader.style.display = 'block';
    titleInput.focus();
}

function closePageCreate() {
    createPageWindow.style.display = 'none';
    shader.style.display = 'none';
    titleInput.value = '';
}


