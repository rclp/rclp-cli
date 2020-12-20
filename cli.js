#!/usr/bin/env node

'use strict'

/**
 * Licensed under MIT
 * (https://github.com/rclp/rclp-cli/blob/master/LICENSE)
 */

const fs = require('fs')
const path = require('path')

const clipboardy = require('clipboardy')
const yargs = require('yargs')

const Config = require('./lib/config')
const ConfigUtility = require('./lib/config-utility')
const OperationUtility = require('./lib/operation-utility')
const DesktopNotifier = require('./lib/desktop-notifier')

const authenticationOperation = require('./authentication-operation')
const copyOperation = require('./copy-operation')
const pasteOperation = require('./paste-operation')
const userOperation = require('./user-operation')

let currentPasteValue = null

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
 *
 * @return {string} Config file path.
 */
async function prepareConfigFile() {
  const destination = ConfigUtility.configPath()
  if (!fs.existsSync(destination)) {
    console.log('Config file does not exist, creating one')
    fs.mkdirSync(
        path.dirname(destination),
        {
          recursive: true,
          mode: 0o700,
        })
    const source = path.resolve(__dirname, './default-rclp.json')
    fs.copyFileSync(source, destination)
    fs.chmodSync(destination, 0o600)
  }

  return destination
}

/**
 * Handles specified operations.
 *
 * @param {!Object} argv argv value from Yargs.
 * @param {!Config} config Config object.
 */
async function handleOperations(argv, config) {
  if (argv.auth) {
    try {
      await authenticationOperation(config)
    } catch (exception) {
      throw new Error(`Error executing auth: ${exception.message}`)
    }
  } else if (argv.copy || argv.indefinite || argv.paste || argv.user) {
    // the rest of options require sign in
    // make sure the credential file exists
    if (!fs.existsSync(ConfigUtility.credentialPath())) {
      throw new Error(
          'Credential file does not exist. ' +
          'Try -a option to authenticate first.')
    }

    let mergedConfig
    try {
      const prepared = await prepareCredential(config)
      mergedConfig = await mergeConfig(config, prepared)
    } catch (exception) {
      throw new Error(`Failed to authenticate: ${exception.message}`)
    }

    if (argv.copy) {
      try {
        await copyOperation(mergedConfig)
      } catch (exception) {
        throw new Error(`Error while executing copy: ${exception.message}`)
      }
    } else if (argv.paste || argv.indefinite) {
      let result = null
      try {
        result = await pasteOperation(mergedConfig)
      } catch (exception) {
        throw new Error(`Error while executing paste: ${exception.message}`)
      }

      const previousPasteValue = currentPasteValue
      currentPasteValue = result

      if (argv.paste) {
        console.log(currentPasteValue)
      } else if (argv.indefinite) {
        console.log('setting up timer')
        // setting up a timer to call this function again here because:
        // - doing so right after the if statement above will continue to call
        //   this function even when the pasting operation is failing.
        setTimeout(() => {
          handleOperations(argv, config)
        }, 5000)

        console.log(`pasting to system clipboard: ${currentPasteValue}`)
        try {
          await clipboardy.write(currentPasteValue)
        } catch (exception) {
          throw new Error(
              'Error while pasting it to system clipboard: ' +
              `${exception.message}`)
        }

        // notify only when the paste value has been updated
        console.log(`comparing: '${previousPasteValue}', '${currentPasteValue}'`)
        if (previousPasteValue !== currentPasteValue) {
          try {
            const desktopNotifier = new DesktopNotifier()
            await desktopNotifier.notify(
                'New value pasted',
                'rclp-cli pasted the latest value to your system clipboard')
          } catch (exception) {
            throw new Error(
                'Error while showing a notification: ' +
                `${exception.message}`)
          }
        }
      }
    } else if (argv.user) {
      try {
        await userOperation(mergedConfig)
      } catch (exception) {
        throw new Error(`Error while executing user: ${exception.message}`)
      }
    }
  } else {
    yargs.showHelp()
  }
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
        'copy': {
          description: 'Copy data from stdin',
          required: false,
          boolean: true,
          alias: 'c',
        },
        'indefinite': {
          description: 'Run indefinitely',
          required: false,
          boolean: true,
          alias: 'i',
        },
        'paste': {
          description: 'Paste data from the remote clipboard',
          required: false,
          boolean: true,
          alias: 'p',
        },
        'user': {
          description: 'Print currently signed in user',
          required: false,
          boolean: true,
          alias: 'u',
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
  let configFilePath
  try {
    configFilePath = await prepareConfigFile()
  } catch (exception) {
    console.error(`Failed to prepare config file: ${exception.message}`)
    process.exit(1)
    return
  }

  // load config
  const config = new Config(configFilePath)
  try {
    await config.load()
  } catch (exception) {
    console.error(`Failed to load config file: ${exception.message}`)
    process.exit(1)
    return
  }

  // execute a specified operation
  currentPasteValue = null
  try {
    await handleOperations(argv, config)
  } catch (exception) {
    console.error(`Failed to execute the operation: ${exception.message}`)
    process.exit(2)
    return
  }
}
main()
