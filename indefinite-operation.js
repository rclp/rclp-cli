'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const ClipboardsProxy = require('./lib/clipboards-proxy')

const DesktopNotifier = require('./lib/desktop-notifier')

module.exports = async (config) => {
  const clipboardsProxy = new ClipboardsProxy(
      config.apiUrl, config.googleCredential.credential.id_token)
  try {
    const latest = await clipboardsProxy.getLatest()
    console.log(latest)
  } catch (exception) {
    throw new Error('Failed to paste from the clipboard')
  }

  // testing
  try {
    const desktopNotifier = new DesktopNotifier()
    await desktopNotifier.notify('this is title', 'yo this is content yo')
  } catch (exception) {
    console.log(exception)
  }
}
