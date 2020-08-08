'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const GoogleAuthenticator = require('./lib/google-authenticator')
const ConfigUtility = require('./lib/config-utility')

/**
 * Signs in to Google.
 *
 * @param {!Config} config Config object.
 * @return {!GoogleCredential} GoogleCredential object.
 */
async function signInToGoogle(config) {
  const googleAuthenticator =
      new GoogleAuthenticator(config.oauthClientId, config.apiUrl)

  const authUrl = await googleAuthenticator.generateUrl()
  console.log('Open web browser and visit this url to authenticate:\n')
  console.log(`${authUrl}\n`)

  const authCode = await googleAuthenticator.receiveResponse()
  console.log('Finalizing the sign in process...')
  return await googleAuthenticator.getTokensByAuthorizationCode(authCode)
}

module.exports = async (config) => {
  console.log('rclp requires you to sign in to Firebase using Google Account\n')

  console.log('Signing in to Google...')
  const googleCredential = await signInToGoogle(config)
  console.log('You have been signed in to Google.')
  console.log('You will sign in to Firebase when you execute copy/paste.')

  const path = ConfigUtility.credentialPath()
  await googleCredential.saveTo(path)
}
