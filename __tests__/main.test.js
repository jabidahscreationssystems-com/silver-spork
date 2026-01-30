/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { wait } from '../__fixtures__/wait.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/wait.js', () => ({ wait }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.js', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation(() => '500')

    // Mock the wait function so that it does not actually wait.
    wait.mockImplementation(() => Promise.resolve('done!'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )
  })

  it('Sets a failed status', async () => {
    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockReturnValueOnce('this is not a number')

    await run()

    // Verify that the action was marked as failed with the new validation message.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'milliseconds input must be a valid number'
    )
  })

  it('Handles non-Error exceptions', async () => {
    // Clear the wait mock and throw a non-Error exception.
    wait.mockClear().mockRejectedValueOnce('string error')

    await run()

    // Verify that the non-Error exception is converted to string.
    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'string error')
  })

  it('Accepts zero milliseconds as valid input', async () => {
    // Clear the getInput mock and return "0".
    core.getInput.mockClear().mockReturnValueOnce('0')

    await run()

    // Verify that wait was called with 0.
    expect(wait).toHaveBeenCalledWith(0)

    // Verify the action succeeded with time output.
    expect(core.setOutput).toHaveBeenCalledWith(
      'time',
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )
  })
})
