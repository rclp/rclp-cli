'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

/**
 * DesktopNotifierBase defines an interface for desktop notifier
 * implementations.
 */
class DesktopNotifierBase {
  /**
   * Shows a notification.
   *
   * @param {string} title Title.
   * @param {string} content Content.
   */
  async notify(title, content) {
    throw new Error('Not implemeneted');
  }
}

module.exports = DesktopNotifierBase
