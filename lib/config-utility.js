'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const os = require('os')

/**
 * ConfigUtility class provides utility functions around configiration file.
 */
class ConfigUtility {
  /**
   * Returns a configuration file path for Linux.
   *
   * @return {string} Path to config file.
   */
  static configPathLinux() {
    return `${os.homedir()}/.config/rclp/rclp.json`
  }

  /**
   * Returns a credential file path for Linux.
   *
   * @return {string} Path to credential file.
   */
  static credentialPathLinux() {
    return `${os.homedir()}/.config/rclp/credential.json`
  }
}

module.exports = ConfigUtility
