'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const http = require('http')
const https = require('https')

/**
 * ApiClient is an abstract class representing rclp api client.
 */
class ApiClient {
  /**
   * Constructor.
   *
   * @param {string} endpointUrl Endpoint URL.
   */
  constructor(endpointUrl) {
    this.endpointUrl = endpointUrl

    this.httpClient = this.endpointUrl.startsWith('http://') ? http : https
  }

  /**
   * Sends an HTTP request.
   *
   * @param {string} path A path that will be appended to the endpoint URL. It
   *     should start with '/'.
   * @param {!Object} options An object used for standard nodejs http/https
   *     library.
   * @param {Object} data JSON data to send as request body.
   * @return {!Object} Raw response body consisting of:
   *     - statusCode
   *     - data
   */
  async sendRequest(path, options, data = null) {
    return new Promise((resolve, reject) => {
      const endpoint = `${this.endpointUrl}${path}`
      const request = this.httpClient.request(
          endpoint,
          options,
          (response) => {
            const data = []
            response.setEncoding('utf8')
            response.on('data', (chunk) => {
              data.push(chunk)
            })
            response.on('end', () => {
              resolve({
                statusCode: response.statusCode,
                data: data.join(''),
              })
              return
            })
          })
      request.on('error', (error) => {
        reject(new Error('Failed to request tokens by authorization code'))
        return
      })
      if (data) {
        request.write(JSON.stringify(data))
      }
      request.end()
    })
  }

  /**
   * Checks if the status code indicates success.
   *
   * @param {number} statusCode Status code.
   * @return {boolean} True if success, false otherwise.
   */
  async isSuccess(statusCode) {
    return statusCode >= 200 && statusCode <= 299
  }
}

module.exports = ApiClient
