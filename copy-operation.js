'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const ClipboardsProxy = require('./lib/clipboards-proxy')
const OperationUtility = require('./lib/operation-utility')

module.exports = async (config) => {
  try {
    const readFromStdin = await OperationUtility.readFromStdin()

    const clipboardsProxy = new ClipboardsProxy(
        config.apiUrl, config.googleCredential.credential.id_token)
    await clipboardsProxy.setLatest(readFromStdin)
  } catch (exception) {
    throw new Error('Failed to read from stdin')
  }
}
