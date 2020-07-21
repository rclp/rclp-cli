'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const { once } = require('events')
const { createInterface } = require('readline')

const ConfigUtility = require('./config-utility')
const GoogleAuthenticator = require('./google-authenticator')
const GoogleCredential = require('./google-credential')

/**
 * OperationUtility provides utility functions around CLI operations.
 */
class OperationUtility {
  /**
   * Checks if a credential exists.
   *
   * @return {!GoogleCredential} GoogleCredential object if signed in, null
   *     otherwise.
   */
  static async retrieveCredential() {
    try {
      const path = ConfigUtility.credentialPathLinux()
      return await GoogleCredential.loadFrom(path)
    } catch (exception) {
      throw new Error('Failed to load credential')
    }
  }

  /**
   * Refreshes the credential.
   *
   * @param {string} oauthClientId OAuth2 client ID.
   * @param {string} apiUrl API url.
   * @param {!GoogleCredential} googleCredential GoogleCredential.
   * @return {!GoogleCredential} GoogleCredential with the refreshed credential.
   */
  static async refreshCredential(oauthClientId, apiUrl, googleCredential) {
    let refreshedGoogleCredential
    try {
      const googleAuthenticator =
          new GoogleAuthenticator(oauthClientId, apiUrl)
      refreshedGoogleCredential =
          await googleAuthenticator.getTokensByRefreshToken(googleCredential)
    } catch (exception) {
      throw new Error(`Failed to refresh tokens: ${exception.message}`)
    }

    try {
      const path = ConfigUtility.credentialPathLinux()
      await refreshedGoogleCredential.saveTo(path)
    } catch (exception) {
      throw new Error(`Failed to save credential: ${exception.message}`)
    }

    return refreshedGoogleCredential
  }

  /**
   * Reads input from stdin.
   *
   * @return {string} Input from stdin.
   */
  static async readFromStdin() {
    const lines = []

    try {
      const stdin = createInterface({
        input: process.stdin,
      })
      stdin.on('line', (line) => {
        lines.push(line)
        stdin.close()
      })
      await once(stdin, 'close')
    } catch (exception) {
      throw new Error(`Error reading from stdin: ${exception.message}`)
    }

    return lines.join('')
  }
}

module.exports = OperationUtility
