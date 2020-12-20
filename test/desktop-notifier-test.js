'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const assert = require('assert')
const os = require('os')

const DesktopNotifier = require('../lib/desktop-notifier')
const DesktopNotifierNotifySend = require('../lib/desktop-notifier-notify-send')
const DesktopNotifierOsascript = require('../lib/desktop-notifier-osascript')
const DesktopNotifierBurntToast = require('../lib/desktop-notifier-burnttoast')

describe('DesktopNotifer', () => {
  let desktopNotifier = null

  beforeEach(() => {
    desktopNotifier = new DesktopNotifier()
  })

  context('on Linux', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'linux') {
        this.skip()
      }
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

    it('uses display notification via osascript', () => {
      assert.strictEqual(
          desktopNotifier.notifier instanceof DesktopNotifierOsascript,
          true)
    })
  })

  context('on Windows', () => {
    before(function beforeFunction() {
      if (os.type().toLowerCase() !== 'windows_nt') {
        this.skip()
      }
    })

    it('uses BurntToast', () => {
      assert.strictEqual(
          desktopNotifier.notifier instanceof DesktopNotifierBurntToast,
          true)
    })
  })
})
