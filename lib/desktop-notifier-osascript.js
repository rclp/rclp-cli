'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const { spawn } = require('child_process')

const DesktopNotifierBase = require('./desktop-notifier-base')

/**
 * DesktopNotifierOsascript implements a desktop notification using
 * a tool display notification via osascript.
 */
class DesktopNotifierOsascript extends DesktopNotifierBase {
  /**
   * @override
   */
  async notify(title, content) {
    const script = `display notification "${content}" with title "${title}"`
    const childProcess =
        spawn('osascript', ['-e', script], { shell: false })
    setTimeout(() => {
      if (childProcess.exitCode === null) {
        console.log('Notification process is still running...')
        const killResult = childProcess.kill()
        console.log(killResult)
      }
    }, 1500)
  }
}

module.exports = DesktopNotifierOsascript
