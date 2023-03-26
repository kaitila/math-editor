import { Caret } from "./utils.js";
import { Math } from "./math.js";
import { closeBrackets, deleteMatching, getMatching } from "./brackets.js";

//get input field elements
const texInput = document.getElementById('texInput');
const editInput = document.getElementById('editInput');
const editor = document.getElementById('editor');

const caret = new Caret(editor, window);
const math = new Math(window, document, caret, texInput, editInput);

//add events to buttons
document.getElementById('addBtn').onclick = () => math.add(texInput.value);
document.getElementById('editBtn').onclick = () => math.update(editInput.value);
document.getElementById('cancelBtn').onclick = () => math.cancel();

//radio buttons
document.querySelectorAll('.prefix').forEach(elem => {
    elem.addEventListener('click', () => math.prefix = elem.value);
});

texInput.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Enter':
            e.preventDefault();
            math.add(texInput.value);
            break;
    }
})

editInput.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'Enter':
            e.preventDefault();
            math.update(editInput.value);
            break;
        case 'Escape':
            e.preventDefault();
            math.cancel();
    }
})

document.querySelectorAll('.inputField').forEach(elem => {
    elem.addEventListener('input', (e) => closeBrackets(e));
    elem.addEventListener('keydown', (e) => {
        if(e.key == 'Backspace' || e.key == 'Delete') {
            deleteMatching(e);
        }
    });
});

editor.addEventListener('keydown', (e) => {
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


