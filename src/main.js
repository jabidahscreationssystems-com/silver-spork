import * as core from '@actions/core'
import { wait } from './wait.js'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const ms = core.getInput('milliseconds')

    // Validate input early to fail fast
    const parsedMs = parseInt(ms, 10)
    if (ms === '' || isNaN(parsedMs)) {
      throw new Error('milliseconds input must be a valid number')
    }

    if (parsedMs < 0) {
      throw new Error('milliseconds cannot be negative')
    }

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${parsedMs} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parsedMs)

    // Cache the end time to avoid creating multiple Date objects
    const endTime = new Date().toTimeString()
    core.debug(endTime)

    // Set outputs for other workflow steps to use
    core.setOutput('time', endTime)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(String(error))
    }
  }
}
