'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const fs = require('fs')

/**
 * Config represents a configuration for rclp.
 *
 * Note: it currently supports only one user in the config file. The
 * implementation follows this assumption.
 */
class Config {
  /**
   * Constructor.
   *
   * @param {string} path Configuration file path.
   */
  constructor(path) {
    this.path = path
    this.config = {}
  }

  /**
   * Loads a configuration file.
   */
  async load() {
    try {
      const data = fs.readFileSync(this.path, { encoding: 'utf-8' })
      this.config = JSON.parse(data)
    } catch (exception) {
      throw new Error(
          `Error loading config file [${this.path}]: ${exception.message}`)
    }
  }

  /**
   * Returns an API url.
   *
   * @return {string} API url.
   */
  get apiUrl() {
    return this.config.apiUrl
  }

  /**
   * Returns an OAuth2 client ID.
   *
   * @return {string} OAuth2 client ID.
   */
  get oauthClientId() {
    return this.config.oauthClientId
  }
}

module.exports = Config
