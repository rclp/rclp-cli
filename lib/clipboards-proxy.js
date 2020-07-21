'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const ApiClient = require('./api-client')

/**
 * ClipboardsProxy proxies clibpard related operations.
 */
class ClipboardsProxy extends ApiClient {
  /**
   * @override
   */
  constructor(endpointUrl, googleIdToken) {
    super(endpointUrl)

    this.googleIdToken = googleIdToken
  }

  /**
   * Retrieves the latest.
   *
   * @return {string} The latest data from the clipboard.
   */
  async getLatest() {
    let response
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.googleIdToken}`,
        },
      }
      response = await this.sendRequest('/clipboards/latest', options)
    } catch (exception) {
      console.error(exception)
      throw new Error('Failed to retrieve the latest data')
    }

    let success
    try {
      success = await this.isSuccess(response.statusCode)
    } catch (exception) {
      throw new Error('Failed to check the response status code')
    }
    if (!success) {
      throw new Error('The API returned non-success status code')
    }

    try {
      const data = JSON.parse(response.data)
      return data.content
    } catch (exception) {
      console.error(exception)
      throw new Error('Failed to parse the response')
    }
  }

  /**
   * Updates the latest.
   *
   * @param {string} data Data.
   */
  async setLatest(data) {
    let response

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.googleIdToken}`,
        },
      }
      const body = {
        content: data,
      }
      response = await this.sendRequest('/clipboards/latest', options, body)
    } catch (exception) {
      console.error(exception)
      throw new Error('Failed to update the latest data')
    }

    if (!this.isSuccess(response.statusCode)) {
      throw new Error('The API returned non-success status code')
    }
  }
}

module.exports = ClipboardsProxy
