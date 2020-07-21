'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const assert = require('assert')

const ConfigUtility = require('../lib/config-utility')

describe('ConfigUtility', () => {
  context('Config file', () => {
    it('returns config file path for Linux', () => {
      assert.strictEqual(
          ConfigUtility.configPathLinux(),
          `${process.env.HOME}/.config/rclp/rclp.json`)
    })

    it.skip('returns config file path for Windows', () => {
      assert.strictEqual(
          ConfigUtility.configPathWindows(),
          `${process.env.HOME}/.config/rclp/rclp.json`)
    })
  })

  context('Credential', () => {
    it('returns credential file path for Linux', () => {
      assert.strictEqual(
          ConfigUtility.credentialPathLinux(),
          `${process.env.HOME}/.config/rclp/credential.json`)
    })
  })
})
