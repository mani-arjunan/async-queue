
export type Node<T> = {
  val: T;
  next: Node<T> | null;
};

class Stack<T> {
  private head: Node<T> | null;
  private length: number;

  constructor(val: T) {
    this.head = val
      ? {
          val,
          next: null,
        }
      : null;
    this.length = val ? 1 : 0;
  }

  push(val: T): number {
    const node: Node<T> = {
      val,
      next: null,
    };
    this.length++;
    if (!this.head) {
      this.head = node;
      return this.length;
    }
    node.next = this.head;
    this.head = node;
    return this.length;
  }

  pop(): T | null {
    const node = this.head;
    if(node) {
      this.head = node.next;
      this.length--;
    }
    return node?.val || null
  }
}


const s1 = new Stack<number>(10);
s1.push(1)
s1.push(2)
s1.push(3)
console.info(s1.pop())
console.info(s1.pop())
console.info(s1.pop())
console.info(s1.pop())
console.info(s1.pop())
console.info(s1.pop())
