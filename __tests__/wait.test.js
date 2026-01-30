/**
 * Unit tests for src/wait.js
 */
import { wait } from '../src/wait.js'

describe('wait.js', () => {
  it('Throws an invalid number', async () => {
    const input = parseInt('foo', 10)

    expect(isNaN(input)).toBe(true)

    await expect(wait(input)).rejects.toThrow('milliseconds is not a number')
  })

  it('Throws on negative numbers', async () => {
    await expect(wait(-100)).rejects.toThrow('milliseconds cannot be negative')
  })

  it('Waits with a valid number', async () => {
    const start = new Date()
    await wait(500)
    const end = new Date()

    const delta = Math.abs(end.getTime() - start.getTime())

    expect(delta).toBeGreaterThan(450)
  })

  it('Waits with zero milliseconds', async () => {
    const result = await wait(0)

    expect(result).toBe('done!')
  })
})
