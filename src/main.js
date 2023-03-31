import { closeBrackets, deleteMatching } from "./brackets.js";
import { PageHandler } from "./page.js";
import { closeOptions } from "./utils.js";

//get input field elements
const texInput = document.getElementById('texInput');
const editor = document.getElementById('editor');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const addPage = document.getElementById('addPage');

const pageHandler = new PageHandler(editor);
window.onload = () => pageHandler.addPage('Untitled');

//add events to buttons
addBtn.addEventListener('click', () => {
    if (pageHandler.active.inputMode == 'add') pageHandler.active.addLatex(texInput.value);
    if (pageHandler.active.inputMode == 'edit') pageHandler.active.update(texInput.value);
    texInput.value = '';
});

cancelBtn.onclick = () => pageHandler.active.cancel();

//radio buttons
document.querySelectorAll('.prefix').forEach(elem => {
    elem.addEventListener('click', () => pageHandler.setPrefix(elem.value));
});

texInput.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Enter':
            e.preventDefault();
            if (pageHandler.active.inputMode == 'add') pageHandler.active.addLatex(texInput.value);
            if (pageHandler.active.inputMode == 'edit') pageHandler.active.update(texInput.value);
            texInput.value = '';
            break;
        case 'Backspace':
            deleteMatching(e);
            break;
        case 'Delete':
            deleteMatching(e);
            break;
        case 'Escape':
            if (pageHandler.active.inputMode == 'edit') pageHandler.active.cancel();
            break;
    }
});

texInput.addEventListener('input', (e) => closeBrackets(e));
texInput.addEventListener('focus', () => {
    if(pageHandler.active.inputMode == 'edit') {
        addBtn.value = 'Edit';
        cancelBtn.classList.remove('hide');
    }
});

texInput.addEventListener('blur', () => {
    addBtn.value = 'Add';
    cancelBtn.classList.add('hide');
});

document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key == 'e') {
        e.preventDefault();
        texInput.focus();
    }
});

editor.addEventListener('keyup', () => {
    pageHandler.active.caret.getCaret();
    pageHandler.save();
});

editor.addEventListener('click', () => {
    pageHandler.active.caret.getCaret();
    pageHandler.active.cancel();
    pageHandler.save();
});

editor.addEventListener('focus', () => {
    document.querySelectorAll('.tex').forEach(elem => {
        if(!elem.classList.contains('active')) {
            elem.classList.add('active');
        }

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