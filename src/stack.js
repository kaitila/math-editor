export class Stack {
    constructor() {
      this.items = [];
    }
 
    // add element to the stack
    push(element) {
      return this.items.push(element);
    }
 
    // remove element from the stack
    pop() {
      if (this.items.length > 0) {
        return this.items.pop();
      }
    }
 
    // view the last element
    top() {
      return this.items[this.items.length - 1];
    }
 
    // check if the stack is empty
    isEmpty() {
      return this.items.length == 0;
    }
 
    // the size of the stack
    size() {
      return this.items.length;
    }
 
    // empty the stack
    clear() {
      this.items = [];
    }
}