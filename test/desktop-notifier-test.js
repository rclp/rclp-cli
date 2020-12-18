'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const assert = require('assert')
const os = require('os')

const DesktopNotifier = require('../lib/desktop-notifier')
const DesktopNotifierNotifySend = require('../lib/desktop-notifier-notify-send')

describe('DesktopNotifer', () => {
  let desktopNotifier = null

  context('on Linux', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'linux') {
        this.skip()
      }

      desktopNotifier = new DesktopNotifier()
    })

    it('uses notify-send', () => {
      assert.strictEqual(
          desktopNotifier.notifier instanceof DesktopNotifierNotifySend,
          true)
    })
  })

  context('on macOS', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'darwin') {
        this.skip()
      }
    })
  })

  context('on Windows', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'windows_nt') {
        this.skip()
      }
    })
  })
})
