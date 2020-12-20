'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const ClipboardsProxy = require('./lib/clipboards-proxy')

module.exports = async (config) => {
  const clipboardsProxy = new ClipboardsProxy(
      config.apiUrl, config.googleCredential.credential.id_token)
  let result = null
  try {
    result = await clipboardsProxy.getLatest()
  } catch (exception) {
    throw new Error('Failed to paste from the clipboard')
  }

  return result
}
