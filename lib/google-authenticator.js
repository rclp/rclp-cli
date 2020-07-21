'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const http = require('http')
const url = require('url')

const { OAuth2Client } = require('google-auth-library')

const OauthProxy = require('./oauth-proxy')

const GOOGLE_OAUTH2_REDIRECT_HOST = 'localhost'
const GOOGLE_OAUTH2_REDIRECT_PORT = 5000
const GOOGLE_OAUTH2_REDIRECT_PATH = '/callback'
const GOOGLE_OAUTH2_REDIRECT_URI = `http://${GOOGLE_OAUTH2_REDIRECT_HOST}:` +
    `${GOOGLE_OAUTH2_REDIRECT_PORT}${GOOGLE_OAUTH2_REDIRECT_PATH}`

const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]

/**
 * GoogleAuthenticator authenticates a user.
 */
class GoogleAuthenticator {
  /**
   * Constructor.
   *
   * @param {string} oAuth2ClientId OAuth2 client ID.
   * @param {string} apiUrl API url.
   */
  constructor(oAuth2ClientId, apiUrl) {
    // redirect uri is directly read from env variable instead of expecting it
    // to be passed as param like other params because this is something the
    // app should control.
    this.oAuth2Client = new OAuth2Client(
        oAuth2ClientId,
        '',
        GOOGLE_OAUTH2_REDIRECT_URI)

    this.codeChallenge = null
    this.codeVerifier = null

    this.oauthProxy = new OauthProxy(apiUrl)
  }

  /**
   * Returns a URL for authentication.
   *
   * @return {string} URL for authentication.
   */
  async generateUrl() {
    // this assumes that calling this method more than once will invalidate the
    // previously generated code challenge/varifer.
    try {
      const codes = await this.oAuth2Client.generateCodeVerifierAsync()
      this.codeChallenge = codes.codeChallenge
      this.codeVerifier = codes.codeVerifier
    } catch (exception) {
      throw new Error(`Failed to generate code verifier: ${exception.message}`)
    }

    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: OAUTH_SCOPES.join(' '),
      prompt: 'select_account',
      code_challenge_method: 'S256',
      code_challenge: this.codeChallenge,
    })
  }

  /**
   * Waits until it receives authentication response.
   *
   * @return {string} OAuth2 authoriation code.
   */
  async receiveResponse() {
    return new Promise((resolve, reject) => {
      const server = http.createServer((request, response) => {
        const requestUrl = new url.URL(request.url, `http://localhost:5000`)

        // return 404 as we are not interested in responding to this
        if (requestUrl.pathname !== GOOGLE_OAUTH2_REDIRECT_PATH) {
          response.writeHead(404, { 'Content-Type': 'text/plain' })
          response.end()
          return
        }

        response.writeHead(200, { 'Content-Type': 'text/plain' })
        response.end(
            'Authentication is done. Go back to the terminal to continue.')

        const authError = requestUrl.searchParams.get('error')
        const authCode = requestUrl.searchParams.get('code')

        server.close(() => {
          if (authError) {
            reject(new Error(`User did not sign in: ${authError}`))
            return
          }

          resolve(authCode)
          return
        })
      })
      server.listen(GOOGLE_OAUTH2_REDIRECT_PORT, GOOGLE_OAUTH2_REDIRECT_HOST)
    })
  }

  /**
   * Retrieves a token using authorization code.
   *
   * @param {string} authorizationCode Authorization code.
   * @return {!GoogleCredential} GoogleCredential.
   */
  async getTokensByAuthorizationCode(authorizationCode) {
    try {
      return this.oauthProxy.getTokensByAuthorizationCode(
          authorizationCode, this.codeVerifier)
    } catch (exception) {
      throw new Error('Failed to get tokens by authorization code via proxy')
    }
  }

  /**
   * Retrieves a token using refresh token.
   *
   * @param {!GoogleCredential} credential GoogleCredential object.
   * @return {!GoogleCredential} GoogleCredential.
   */
  async getTokensByRefreshToken(credential) {
    try {
      return this.oauthProxy.getTokensByRefreshToken(credential)
    } catch (exception) {
      throw new Error('Failed to get tokens by refresh token via proxy')
    }
  }
}

module.exports = GoogleAuthenticator
