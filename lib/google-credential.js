'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const fs = require('fs')
const path = require('path')

/**
 * GoogleCredential represents a Google OAuth2 credential.
 */
class GoogleCredential {
  /**
   * Constructor.
   *
   * @param {!Object} credential An object representing a Google OAuth2
   *     credential that expects the following attributes:
   *     - access_token
   *     - refresh_token
   *     - scope
   *     - token_type
   *     - id_token
   *     - expiry_date
   */
  constructor(credential) {
    this.credential = credential
  }

  /**
   * Gets credential.
   *
   * @return {!Object} Credential.
   */
  get credential() {
    return JSON.parse(JSON.stringify(this.googleCredential))
  }

  /**
   * Sets credential.
   *
   * @param {!Object} credential Credential.
   */
  set credential(credential) {
    this.googleCredential = JSON.parse(JSON.stringify(credential))
  }

  /**
   * Loads the credential from a file.
   *
   * @param {string} filePath File path to load from
   * @return {!GoogleCredential} GoogleCredential object.
   */
  static async loadFrom(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      const credential = JSON.parse(data)
      return new GoogleCredential(credential)
    } catch (exception) {
      throw new Error(`Failed to load credential: ${exception.message}`)
    }
  }

  /**
   * Saves the credential as a file.
   *
   * @param {string} filePath File path to save to.
   */
  async saveTo(filePath) {
    try {
      const directoryPath = path.dirname(filePath)
      fs.mkdirSync(directoryPath, { recursive: true })
      fs.writeFileSync(
          filePath,
          JSON.stringify(this.credential),
          { encoding: 'utf8' })
      fs.chmodSync(filePath, 0o600)
    } catch (exception) {
      throw new Error(`Failed to save credential: ${exception.message}`)
    }
  }
}

module.exports = GoogleCredential
