'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

module.exports = async (config) => {
  const credential = config.googleCredential.credential
  const idToken = credential.id_token
  const segments = idToken.split('.')
  if (segments.length !== 3) {
    throw new Error('Invalid credential format')
  }

  const payloadRaw = Buffer.from(segments[1], 'base64')
  try {
    const payload = JSON.parse(payloadRaw)
    console.log(`Currently signed in as: ${payload.email}`)
  } catch (exception) {
    throw new Error('Failed to parse id token payload')
  }
}
