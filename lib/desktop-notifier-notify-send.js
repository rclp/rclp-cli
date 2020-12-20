'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const { spawn } = require('child_process')

const DesktopNotifierBase = require('./desktop-notifier-base')

/**
 * DesktopNotifierNotifySend implements a desktop notification using
 * a tool notify-send.
 */
class DesktopNotifierNotifySend extends DesktopNotifierBase {
  /**
   * @override
   */
  async notify(title, content) {
    const childProcess =
        spawn('notify-send', [title, content], { shell: false })
    setTimeout(() => {
      if (childProcess.exitCode === null) {
        console.log('Notification process is still running...')
        const killResult = childProcess.kill()
        console.log(killResult)
      }
    }, 1500)
  }
}

module.exports = DesktopNotifierNotifySend
