/**
 * Waits for a number of milliseconds.
 *
 * @param {number} milliseconds The number of milliseconds to wait.
 * @returns {Promise<string>} Resolves with 'done!' after the wait is over.
 */
export async function wait(milliseconds) {
  if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
    throw new Error('milliseconds is not a number')
  }

  if (milliseconds < 0) {
    throw new Error('milliseconds cannot be negative')
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve('done!'), milliseconds)
  })
}
