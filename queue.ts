export type Node<T> = {
  val: T;
  next: Node<T> | null;
};

export class Queue<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private length: number;

  constructor(val?: T) {
    this.head = val
      ? {
          val,
          next: null,
        }
      : null;
    this.tail = this.head;
    this.length = val ? 1 : 0;
  }

  enqueue(val: T): void {
    const node = {
      val,
      next: null,
    };
    this.length++;
    if (!this.tail) {
      this.head = this.tail = node;
      return;
    }
    this.tail.next = node;
    this.tail = node;
  }

  dequeue(): T | null {
    const head = this.head;
    if (head) {
      this.head = head.next;
      this.length--;
      if (this.length === 0) {
        this.tail = null;
      }
    }
    return head?.val || null;
  }

  peek(): T | null {
    return this.head?.val || null;
  }
}
// const s1 = new Queue<number>(10);
// s1.enqueue(1);
// console.info(s1.dequeue());
// console.info(s1.peek());
// s1.enqueue(2);
// s1.enqueue(3);

class AsyncQueue<T> extends Queue<{
  action: () => Promise<T>;
  res: (value: T | PromiseLike<T>) => void;
  rej: (reason?: unknown) => void;
}> {
  private pendingPromise: boolean = false;

  constructor() {
    super();
  }

  asyncEnqueue(action: () => Promise<T>): Promise<T> {
    console.log("COMINg");
    return new Promise(async (res, rej) => {
      super.enqueue({ action, res, rej });
      this.asyncDequeue();
    });
  }

  async asyncDequeue() {
    if (this.pendingPromise) {
      return false;
    }

    let item = super.dequeue();

    if (!item) {
      return false;
    }
    try {
      this.pendingPromise = true;
      const result = await item.action();
      this.pendingPromise = false;
      item.res(result);
    } catch (e) {
      this.pendingPromise = false;
      item.rej(e);
    } finally {
    }
  }
}

(async function () {
  let _ =
    ({
      ms,
      url,
      data,
    }: {
      ms: number;
      url: string;
      data: Record<string, string>;
    }) =>
    () =>
      new Promise((resolve) => setTimeout(resolve, ms, { url, data }));

  const p1 = _({
    ms: 1000,
    url: "fetch(1)",
    data: { name: "mani1" },
  }) as unknown as () => Promise<number>;
  const p2 = _({
    ms: 2000,
    url: "fetch(2)",
    data: { name: "mani1" },
  }) as unknown as () => Promise<number>;
  const p3 = _({
    ms: 10,
    url: "fetch(3)",
    data: { name: "mani1" },
  }) as unknown as () => Promise<number>;
  const p4 = _({
    ms: 4000,
    url: "fetch(4)",
    data: { name: "mani1" },
  }) as unknown as () => Promise<number>;
  const p5 = _({
    ms: 1000,
    url: "fetch(5)",
    data: { name: "mani1" },
  }) as unknown as () => Promise<number>;

  const asyncQueue = new AsyncQueue<number>();
  const start = performance.now();
  asyncQueue.asyncEnqueue(p1).then(data => { console.info(data, performance.now() - start )})
  asyncQueue.asyncEnqueue(p2).then(data => { console.info(data, performance.now() - start )})
  asyncQueue.asyncEnqueue(p3).then(data => { console.info(data, performance.now() - start )})
  // const result1 = await asyncQueue.asyncEnqueue(p1);
  // console.info(result1, performance.now() - start);
  // const result2 = await asyncQueue.asyncEnqueue(p2);
  // console.info(result2, performance.now() - start);
  // const result3 = await asyncQueue.asyncEnqueue(p3);
  // console.info(result3, performance.now() - start);
  // const result4 = await asyncQueue.asyncEnqueue(p4);
  // console.info(result4, performance.now() - start);
  // const result5 = await asyncQueue.asyncEnqueue(p5);
  // console.info(result5, performance.now() - start);
})();
