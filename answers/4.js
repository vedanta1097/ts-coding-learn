function* promiseAccumulation(promiseArr) {
  for (const promise of promiseArr) {
    try {
      const result = yield promise; // Wait for the promise to resolve
      yield result; // Yield the resolved value
    } catch (error) {
      yield -1; // Yield -1 if the promise is rejected
      return; // Stop yielding values after encountering a rejection
    }
  }
}

// Example usage:
const promises = [Promise.resolve(10), Promise.reject(), Promise.resolve(20)];

const generator = promiseAccumulation(promises);

function handlePromiseResult(result) {
  const { value, done } = generator.next(result);

  if (!done) {
    // If not done, handle the next promise
    value.then(handlePromiseResult).catch(handlePromiseResult);
  }
}

// Start the generator
handlePromiseResult();