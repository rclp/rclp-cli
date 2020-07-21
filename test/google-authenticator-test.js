'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const assert = require('assert')

const { OAuth2Client } = require('google-auth-library')

const GoogleAuthenticator = require('../lib/google-authenticator')

describe('GoogleAuthenticator', () => {
  let authenticator

  beforeEach(() => {
    const oAuth2Client = new OAuth2Client()
    authenticator = new GoogleAuthenticator(oAuth2Client, 'api')
  })

  afterEach(() => {
    authenticator = null
  })

  it('provides a url for authentication', async () => {
    assert.match(
        await authenticator.generateUrl('test-challenge-code'),
        /^https:\/\/accounts.google.com\/o\/oauth2\/v2\/auth\?/)
  })
})
