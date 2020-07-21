'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const assert = require('assert')

const Config = require('../lib/config')

describe('Config', () => {
  let config

  beforeEach(() => {
    config = new Config('./test/resources/rclp.json')
  })

  afterEach(() => {
    config = null
  })

  it('reads a config file', async () => {
    assert.doesNotReject(async () => {
      await config.load()
    })
  })

  context('after the configuration file is loaded', () => {
    beforeEach(async () => {
      await config.load()
    })

    it('returns api url', async () => {
      assert.strictEqual(
          config.apiUrl,
          'https://example.org/rclp')
    })

    it('returns oauth client ID', async () => {
      assert.strictEqual(
          config.oauthClientId,
          'my-oauth2-client-id')
    })
  })
})
