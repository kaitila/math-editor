import { Stack } from "./stack.js";

const closeChars = new Map([
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ]);

export function closeBrackets(e) {
    const pos = e.target.selectionStart;
    const val = [...e.target.value];
        
    const char = val.slice(pos-1, pos)[0];
    const closeChar = closeChars.get(char);
    
    if (closeChar) {
      val.splice(pos, 0, closeChar);
      e.target.value = val.join('');
      e.target.selectionEnd = pos;
    }
}

export function getMatching(expression, index) {
    const char = expression[index];
    const closeChar = closeChars.get(char);
    
    // If index given is invalid and is
    // not an opening bracket.
    if (!closeChar) {
      return -1;
    }
 
    // Stack to store opening brackets.
    let st = new Stack();
    
    // Traverse through string starting from
    // given index.
    for (let i = index; i < expression.length; i++) {
      // If current character is an
      // opening bracket push it in stack.
      if (expression[i] == char) st.push(expression[i]);
      // If current character is a closing
      // bracket, pop from stack. If stack
      // is empty, then this closing
      // bracket is required bracket.
      else if (expression[i] == closeChar) {
        st.pop();
        if (st.isEmpty()) {
          return i;
        }
      }
    }
 
    // If no matching closing bracket
    // is found.
    return -1;
}

export function deleteMatching(e) {
    const pos = e.target.selectionStart;
    const val = [...e.target.value];
        
    const char = val.slice(pos-1, pos)[0];
    const closeChar = closeChars.get(char);
    const matching = getMatching(e.target.value, pos - 1);

    if(matching == -1) return

    val.splice(matching, 1);
    val.splice(pos - 1, 1);
    e.target.value = val.join('');
    e.target.selectionEnd = pos - 1;

    e.preventDefault();
}