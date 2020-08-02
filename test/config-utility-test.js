'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const assert = require('assert')
const os = require('os')
const path = require('path')

const ConfigUtility = require('../lib/config-utility')

describe('ConfigUtility', () => {
  context('on Linux', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'linux') {
        this.skip()
      }
    })

    it('returns config file path for Linux', () => {
      assert.strictEqual(
          ConfigUtility.configPathLinux(),
          path.resolve(process.env.HOME, '.config', 'rclp', 'rclp.json'))
    })

    it('returns credential file path for Linux', () => {
      assert.strictEqual(
          ConfigUtility.credentialPathLinux(),
          path.resolve(process.env.HOME, '.config', 'rclp', 'credential.json'))
    })
  })

  context('on macOS', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'darwin') {
        this.skip()
      }
    })

    it('returns config file path for macOS', () => {
      assert.strictEqual(
          ConfigUtility.configPathMacOs(),
          path.resolve(
              process.env.HOME,
              'Library',
              'Application Support',
              'rclp',
              'rclp.json'))
    })

    it('returns credential file path for macOS', () => {
      assert.strictEqual(
          ConfigUtility.credentialPathMacOs(),
          path.resolve(
              process.env.HOME,
              'Library',
              'Application Support',
              'rclp',
              'credential.json'))
    })
  })

  context('on Windows', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'windows_nt') {
        this.skip()
      }
    })

    it('returns config file path for Windows', () => {
      assert.strictEqual(
          ConfigUtility.configPathWindows(),
          path.resolve(process.env.APPDATA, 'rclp', 'rclp.json'))
    })

    it('returns credential file path for Windows', () => {
      assert.strictEqual(
          ConfigUtility.credentialPathWindows(),
          path.resolve(process.env.APPDATA, 'rclp', 'credential.json'))
    })
  })
})
