'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const os = require('os')
const path = require('path')

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
    return path.resolve(os.homedir(), '.config', 'rclp', 'rclp.json')
  }

  /**
   * Returns a credential file path for Linux.
   *
   * @return {string} Path to credential file.
   */
  static credentialPathLinux() {
    return path.resolve(os.homedir(), '.config', 'rclp', 'credential.json')
  }

  /**
   * Returns a configuration file path for macOS.
   *
   * @return {string} Path to config file.
   */
  static configPathMacOs() {
    return path.resolve(
        os.homedir(),
        'Library',
        'Application Support',
        'rclp',
        'rclp.json')
  }

  /**
   * Returns a credential file path for macOS.
   *
   * @return {string} Path to credential file.
   */
  static credentialPathMacOs() {
    return path.resolve(
        os.homedir(),
        'Library',
        'Application Support',
        'rclp',
        'credential.json')
  }

  /**
   * Returns a configuration file path for Windows.
   *
   * @return {string} Path to config file.
   */
  static configPathWindows() {
    return path.resolve(
        process.env.APPDATA,
        'rclp',
        'rclp.json')
  }

  /**
   * Returns a credential file path for Windows.
   *
   * @return {string} Path to credential file.
   */
  static credentialPathWindows() {
    return path.resolve(
        process.env.APPDATA,
        'rclp',
        'credential.json')
  }
}

module.exports = ConfigUtility
