//get input field elements
texInput = document.getElementById('texInput');
editInput = document.getElementById('editInput');
editor = document.getElementById('editor');

//add events buttons
document.getElementById('addBtn').onclick = () => add(texInput.value);
document.getElementById('editBtn').onclick = () => update(editInput.value);
document.getElementById('cancelBtn').onclick = () => cancel();
editor.onclick = () => cancel();

editor.addEventListener('focus', () => {
    for(let i = document.getElementsByClassName('tex').length - 1; i >= 0; i--) {
        if(!document.getElementsByClassName('tex')[i].classList.contains('active')) {
            document.getElementsByClassName('tex')[i].classList.add('active');
        }
    }
});

editor.addEventListener('blur', () => {
    for(let i = document.getElementsByClassName('active').length - 1; i >= 0; i--) {
        document.getElementsByClassName('active')[i].classList.remove('active');
    }
})

//prefix for newline / inline.
pref = '$$';
//caret position
pos = 0;

let endContainer, endOffset;

//radio buttons
options = document.getElementsByName('option');

for(let i = 0; i < options.length; i++) {
    options[i].onclick = () => {
        pref = options[i].value;
  }
}

//equation count
eq = 0;
//list of equations
eqs = [];
//currently selected equation index
sel = null;

editor.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key == 'e') {
        e.preventDefault();
        texInput.focus();  
    }
})

texInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter') {
        e.preventDefault();
        add(texInput.value);
    }
})

editInput.addEventListener('keydown', (e) => {
    if(e.key == 'Enter') {
        e.preventDefault();
        update(editInput.value);
    }

    if(e.key == 'Escape') {
        e.preventDefault();
        cancel();
    }
})

document.body.onkeyup = () => {
    if(document.activeElement.id == 'editor') {
        getCaret();
    }
}

document.body.onmouseup = () => {
    if(document.activeElement.id == 'editor') {
        getCaret();
    }
}

function add(tex) {
    //Html for tex div
    const texHtml = '<div contenteditable="false" class="tex active" id="' + eq + '">'+ pref + tex + pref +'</div>';

    //store raw latex in eqs array
    eqs.push(tex)

    setCaret();
    pasteHtmlAtCaret(texHtml);

    const texDiv = document.getElementById(eq);

    //render latex
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, toString(eq)]);

    //select click event
    texDiv.onclick = (event) => {
        select(texDiv)
        event.stopPropagation();
    }

    texInput.value = '';
    eq += 1;
}

function update(tex) {
    if(tex == '') {
        document.getElementById(sel).remove();
        return
    }

    document.getElementById(sel).innerHTML = pref + tex + pref;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, sel]);
    eqs[sel] = tex;

    cancel();
}

function select(div) {
    if(sel != null) {
        document.getElementById(sel).classList.remove('selected');
    }
    
    sel = div.id;
    div.classList.add('selected');
    editInput.value = eqs[sel];
    editInput.focus();
}

function cancel() {
    if(sel == null) {
        return;
    }
    document.getElementById(sel).classList.remove('selected');
    sel = null;
    editInput.value = '';

    setCaret();
}

function pasteHtmlAtCaret(html) {
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

function setCaret() {
    window.getSelection().collapse(endContainer, endOffset);
}

function getCaret() {
    endContainer = window.getSelection().getRangeAt(0).endContainer;
    endOffset = window.getSelection().getRangeAt(0).endOffset;
}