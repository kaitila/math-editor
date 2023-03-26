import { Caret } from "./utils.js";
import { Math } from "./math.js";
import { closeBrackets, deleteMatching } from "./brackets.js";

//get input field elements
const texInput = document.getElementById('texInput');
const editor = document.getElementById('editor');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');

const caret = new Caret(editor, window);
const math = new Math(window, document, caret, texInput);

//add events to buttons
addBtn.addEventListener('click', () => {
    if(math.mode == 'add') {
        math.add(texInput.value);
    }

    if(math.mode == 'edit') math.update(texInput.value);
});

cancelBtn.onclick = () => math.cancel();

//radio buttons
document.querySelectorAll('.prefix').forEach(elem => {
    elem.addEventListener('click', () => math.prefix = elem.value);
});

texInput.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Enter':
            e.preventDefault();
            if (math.mode == 'add') math.add(texInput.value);
            if (math.mode == 'edit') math.update(texInput.value);
            break;
        case 'Backspace':
            deleteMatching(e);
            break;
        case 'Delete':
            deleteMatching(e);
            break;
        case 'Escape':
            if (math.mode == 'edit') math.cancel();
            break;
    }
});

texInput.addEventListener('input', (e) => closeBrackets(e));
texInput.addEventListener('focus', () => {
    if(math.mode == 'edit') {
        addBtn.value = 'Edit';
        cancelBtn.classList.remove('hide');
    }
});

texInput.addEventListener('blur', () => {
    math.mode = 'add';
    addBtn.value = 'Add';
    cancelBtn.classList.add('hide');
});

document.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key == 'e') {
        e.preventDefault();
        texInput.focus();
    }
});

editor.addEventListener('keyup', () => caret.getCaret());

editor.addEventListener('click', () => {
    caret.getCaret();
    math.cancel();
});

editor.addEventListener('focus', () => {
    document.querySelectorAll('.tex').forEach(elem => {
        if(!elem.classList.contains('active')) {
            elem.classList.add('active');
        }
    });
});

editor.addEventListener('blur', () => {
    document.querySelectorAll('.active').forEach(elem => {
        elem.classList.remove('active');
    });
});


