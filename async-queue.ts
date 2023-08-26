const start = performance.now();
const delay = (ms: number, index: number) => {
  return new Promise((res) => {
    setTimeout(() => res("Hello" + index), ms);
  });
};

const asyncQueueInSerial = (
  tasks: Array<(index: number) => Promise<unknown>>
) => {
  let index = 0;
  let result: Array<unknown> = [];

  return new Promise((res, rej) => {
    const doTask = () => {
      if (index < tasks.length) {
        tasks[index](index).then((data) => {
          index++;
          console.log(performance.now() - start);
          result.push(data);
          doTask();
        });
      } else {
        res(result);
      }
    };

    doTask();
  });
};

// This will serially start timers and will take 100 seconds to complete
asyncQueueInSerial([
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
  (index: number) => delay(10000, index),
]).then((data) => {
  console.log(data);
});

const asyncQueueInParallel = (
  tasks: Array<(index: number) => Promise<unknown>>,
  maxWorkers: number
) => {
  let index = 0;
  let workers = 0;
  let result: Array<unknown> = [];
  let i = 0;
  return new Promise((res) => {
    const doTask = () => {
      console.log(index, workers);
      if (workers < maxWorkers && index < tasks.length) {
        tasks[index](index).then((data) => {
          const p = performance.now;
          workers--;
          console.log(p() - start);
          result.push(data);
          doTask();
        });
        // if (index === tasks.length - 1) {
        //   while (i < 1e9) {
        //     i++;
        //   }
        //   console.log("DONE");
        // }
        index++;
        workers++;
        doTask();
      } else if (workers === 0 && tasks.length === index) {
        res(result);
      }
    };

    doTask();
  });
};

// this will parallely start timers and will complete this function in 10seconds
asyncQueueInParallel(
  [
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
    (index: number) => delay(10000, index),
  ],
  10
).then((data) => {
  console.log(data);
});
