#!/usr/bin/env node

'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const Config = require('./lib/config')
const ConfigUtility = require('./lib/config-utility')
const OperationUtility = require('./lib/operation-utility')

const authenticationOperation = require('./authentication-operation')
const copyOperation = require('./copy-operation')
const pasteOperation = require('./paste-operation')

/**
 * Prepares for operations.
 *
 * @param {!Config} config Config obejct.
 * @return {!Object} Object with:
 *     - googleCredential
 */
async function prepareCredential(config) {
  // load credential
  let googleCredential
  try {
    googleCredential = await OperationUtility.retrieveCredential()
  } catch (exception) {
    throw new Error('Not signed in. Sign in first.')
  }

  // refresh credential
  let refreshedGoogleCredential
  try {
    refreshedGoogleCredential = await OperationUtility.refreshCredential(
        config.oauthClientId, config.apiUrl, googleCredential)
  } catch (exception) {
    throw new Error(`Failed to refresh credential: ${exception.message}`)
  }

  return {
    googleCredential: refreshedGoogleCredential,
  }
}

/**
 * Merges config with prepared data.
 *
 * @param {!Object} config Config object.
 * @param {!Object} prepared Return value from prepared function.
 * @return {!Object} Merged config.
 */
async function mergeConfig(config, prepared) {
  return Object.assign(
      {},
      {
        apiUrl: config.apiUrl,
        oauthClientId: config.oauthClientId,
        googleCredential: prepared.googleCredential,
      })
}

/**
 * Checks if a config file exists, and create one if there isn't.
 */
async function prepareConfigFile() {
  const destination = ConfigUtility.configPathLinux()
  if (fs.existsSync(destination)) {
    return
  }

  console.log('Config file does not exist, creating one')
  const source = path.resolve(__dirname, './default-rclp.json')
  fs.copyFileSync(source, destination)
}

/**
 * Runs main function.
 */
async function main() {
  const argv = yargs
      .usage('Usage: $0 [options]')
      .options({
        'auth': {
          description: 'Authenticate to rclp',
          required: false,
          boolean: true,
          alias: 'a',
        },
        'indefinite': {
          description: 'Run indefinitely',
          required: false,
          boolean: true,
          alias: 'i',
        },
        'copy': {
          description: 'Copy data from stdin',
          required: false,
          boolean: true,
          alias: 'c',
        },
        'paste': {
          description: 'Paste data from the remote clipboard',
          required: false,
          boolean: true,
          alias: 'p',
        },
        'help': {
          description: 'Show help',
          required: false,
          boolean: true,
          alias: 'h',
        },
      })
      .argv

  // prepare config file
  try {
    await prepareConfigFile()
  } catch (exception) {
    console.error(`Failed to prepare config file: ${exception.message}`)
    process.exit(1)
  }

  // load config
  const config = new Config(ConfigUtility.configPathLinux())
  try {
    await config.load()
  } catch (exception) {
    console.error(`Failed to load config file: ${exception.message}`)
    process.exit(1)
    return
  }

  if (argv.auth) {
    try {
      await authenticationOperation(config)
    } catch (exception) {
      console.error(`Error executing auth: ${exception.message}`)
    }
    return
  } else if (argv.copy || argv.paste || argv.indefinite) {
    // the rest of options require sign in
    // make sure the credential file exists
    if (!fs.existsSync(ConfigUtility.credentialPathLinux())) {
      console.error(
          'Credential file does not exist. ' +
          'Try -a option to authenticate first.')
      process.exit(1)
    }

    let mergedConfig
    try {
      const prepared = await prepareCredential(config)
      mergedConfig = await mergeConfig(config, prepared)
    } catch (exception) {
      console.error(`Failed to authenticate: ${exception.message}`)
      process.exit(2)
    }

    if (argv.copy) {
      try {
        await copyOperation(mergedConfig)
      } catch (exception) {
        console.error(`Error while executing copy: ${exception.message}`)
      }
      return
    } else if (argv.paste) {
      try {
        await pasteOperation(mergedConfig)
      } catch (exception) {
        console.error(`Error while executing paste: ${exception.message}`)
      }
      return
    } else if (argv.indefinite) {
      // TODO: implement
      console.log('This option has not been implemented yet')
      return
    }
  } else {
    yargs.showHelp()
    return
  }
}
main()
