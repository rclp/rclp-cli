'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const http = require('http')
const https = require('https')

const { OAuth2Client } = require('google-auth-library')

const GoogleCredential = require('./google-credential')

/**
 * OauthProxy proxies to OAuth2 endpoints in order to hide OAuth2 client ID.
 */
class OauthProxy {
  /**
   * Constructor.
   *
   * @param {string} apiUrl API url.
   */
  constructor(apiUrl) {
    this.getTokenProxyUrl = `${apiUrl}/tokens`
    this.refreshTokenProxyUrl = `${apiUrl}/tokens/refresh`
  }

  /**
   * Retrieves a token using authorization code.
   *
   * @param {string} authorizationCode Authorization code.
   * @param {string} codeVerifier Code verifier.
   * @return {!GoogleCredential} GoogleCredential object representing the
   *     retrieved tokens.
   */
  getTokensByAuthorizationCode(authorizationCode, codeVerifier) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const data = {
      auth_code: authorizationCode,
      code_verifier: codeVerifier,
    }

    return new Promise((resolve, reject) => {
      const httpClient =
          this.getTokenProxyUrl.startsWith('http://') ? http : https

      const request = httpClient.request(
          this.getTokenProxyUrl,
          options,
          (response) => {
            // TODO: reject after reading the body
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(
                  new Error('Failed to receive tokens by authorization code'))
              return
            }

            const data = []
            response.setEncoding('utf8')
            response.on('data', (chunk) => {
              data.push(chunk)
            })
            response.on('end', () => {
              try {
                const credential = JSON.parse(data.join(''))
                resolve(new GoogleCredential(credential))
                return
              } catch (exception) {
                reject(new Error('Failed to JSON.parse the received tokens'))
                return
              }
            })
          })
      request.on('error', (error) => {
        reject(new Error('Failed to request tokens by authorization code'))
        return
      })
      request.write(JSON.stringify(data))
      request.end()
    })
  }

  /**
   * Retrieves a token using refresh token.
   *
   * @param {!GoogleCredential} credential GoogleCredential object.
   * @return {!GoogleCredential} GoogleCredential object representing the
   *     retrieved tokens.
   */
  async getTokensByRefreshToken(credential) {
    let shouldRefresh
    try {
      shouldRefresh = await this.shouldRefreshTokens(credential)
    } catch (exception) {
      console.error(exception)
      throw new Error('Error determining if tokens should be refreshed')
    }

    if (!shouldRefresh) {
      // console.log('Not needing a refresh, reusing it')
      return new GoogleCredential(credential.credential)
    }

    console.log('Refresh is required, using refresh token')
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const data = {
      refresh_token: credential.credential.refresh_token,
    }

    const httpClient =
        this.refreshTokenProxyUrl.startsWith('http://') ? http : https

    return new Promise((resolve, reject) => {
      const request = httpClient.request(
          this.refreshTokenProxyUrl,
          options,
          (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(
                  new Error('Failed to receive tokens by refresh token'))
              return
            }

            const data = []
            response.setEncoding('utf8')
            response.on('data', (chunk) => {
              data.push(chunk)
            })
            response.on('end', () => {
              try {
                const credential = JSON.parse(data.join(''))
                resolve(new GoogleCredential(credential))
                return
              } catch (exception) {
                reject(new Error('Failed to JSON.parse the received tokens'))
                return
              }
            })
          })
      request.on('error', (error) => {
        reject(new Error('Failed to request tokens by refresh token'))
        return
      })
      request.write(JSON.stringify(data))
      request.end()
    })
  }

  /**
   * @private
   * @param {!GoogleCredential} credential GoogleCredential object.
   * @return {boolean} True if it should be refreshed, false otherwise.
   */
  async shouldRefreshTokens(credential) {
    const oAuth2Client = new OAuth2Client('', '', '')
    oAuth2Client.setCredentials(credential.credential)
    return oAuth2Client.isTokenExpiring()
  }
}

module.exports = OauthProxy
