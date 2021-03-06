'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const os = require('os')

const DesktopNotifierNotifySend = require('./desktop-notifier-notify-send')
const DesktopNotifierOsascript = require('./desktop-notifier-osascript')
const DesktopNotifierBurntToast = require('./desktop-notifier-burnttoast')

/**
 * DesktopNotifier shows a notification on desktop.
 */
class DesktopNotifier {
  /**
   * Constructor.
   */
  constructor() {
    this.notifier = null

    switch (os.type().toLowerCase()) {
      case 'linux':
        this.notifier = new DesktopNotifierNotifySend()
        break
      case 'darwin':
        this.notifier = new DesktopNotifierOsascript()
        break
      case 'windows_nt':
        this.notifier = new DesktopNotifierBurntToast()
        break
      default:
        throw new Error('Running on unsupported platform')
    }
  }

  /**
   * Shows a notification on desktop.
   *
   * @param {string} title Title.
   * @param {string} content Content.
   */
  async notify(title, content) {
    try {
      this.notifier.notify(title, content)
    } catch (exception) {
      console.log(`Failed to show a notification: ${exception.message}`)
    }
  }
}

module.exports = DesktopNotifier
