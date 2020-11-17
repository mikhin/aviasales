export default async function retry(fn: () => Promise<void>, retriesLeft = 5, interval = 500): Promise<void> {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft > 0) {
      await new Promise(resolve => setTimeout(resolve, interval));

      return retry(fn, retriesLeft - 1, interval);
    }
    throw error;
  }
}
