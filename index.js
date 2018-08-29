#!/usr/bin/env node
// create a sequential list of tasks
// https://github.com/SamVerschueren/listr
const btoa = require('btoa')
const exec = require('child_process').exec
const fetch = require('node-fetch')
const inquirer = require('inquirer')
const ora = require('ora')
const program = require('commander')
const fs = require('fs')
const path = require('path')
const colors = require('colors')

const getBranches = require('./src/get-branches')
const init = require('./src/init')
const installBase = require('./src/install-base')
const installComponent = require('./src/install-component')
const installFork = require('./src/install-fork')
const installModule = require('./src/install-module-subtree')
const installPackage = require('./src/install-package')
const modules = require('./src/modules')
const { sequence } = require('./src/utils')
const Listr = require('listr')

require('./src/scripts')

/*
core-cli init [siteurl] [modules...]
core-cli module install [module] [branch]
core-cli module update [module] [branch]
core-cli module pull [module] [branch]
core-cli module push [module] [branch]
core-cli module list [module] [branch]
core-cli module symbolic-ref <sha-1>
*/

program
  .command('spinner')
  .description('initialize a project')
  .action(function() {
    getBranches('core-blog')  
  })

program
  .command('tasks')
  .description('Task runner')
  .action(function() {
    const tasks = new Listr([
      {
        title: 'Success',
        task: () => Promise.resolve('Foo')
      },
      {
        title: 'Failure',
        task: () => Promise.resolve(new Error('Bar'))
      }
    ]);
    tasks.run()
  })

const configFileName = (process.env.HOME || process.env.HOMEPATH) + '/.coredna'
const writeConfig = config => fs.writeFileSync(configFileName, JSON.stringify(config, null, 2))
const readConfig = () => JSON.parse(fs.readFileSync(configFileName, 'utf-8')) || {}

program
  .command('config')
  .description('Set your config')
  .option(`--account ${colors.cyan('<account>')}`, `Your agencies bitbucket account name ${colors.cyan('(string)')}`)
  .option(`--ssh ${colors.cyan('[ssh]')}`, `Do you use an ssh private key for bitbucket ${colors.cyan('(bool)')}`)
  .option(`--username ${colors.cyan('<account>')}`, `Bitbucket username ${colors.cyan('(string)')}`)
  .action(function(options) {
    const configFileName = (process.env.HOME || process.env.HOMEPATH) + '/.coredna'
    // set the
    // check to see if the user has an ssh key using
    // ssh -T git@bitbucket.org
    // logged in:
    if (!fs.existsSync(configFileName)) {
      writeConfig({})
    }
    // get the config file from the home directory
    const config = readConfig()
    
    // handle options being set in the command
    if (options.account || options.ssh || options.username) {
      try {
        if (options.ssh) {
          var ssh = JSON.parse(options.ssh)
        }
      } catch (e) {
        throw new Error(`ssh needs to be a boolean (true|false|0|1)`) 
      }
      return writeConfig({ 
        account: typeof options.account !== 'undefined' ? options.account : config.account, 
        ssh: typeof ssh === 'boolean' ? ssh : config.ssh, 
        username: typeof options.username !== 'undefined' ? options.username : config.username, 
      })
    }
    
    // if no options provided use the config wizard
    return inquirer.prompt([
      {
        name: 'account',
        type: 'input',
        message: `${colors.magenta('account')}: `,
        default: config.account || 'synthet1c',
        prefix: colors.cyan('~'),
        suffix: 'Your agencies bitbucket account name'
      },
      {
        name: 'ssh',
        type: 'confirm',
        message: `${colors.magenta('ssh')}: `,
        default: config.ssh || true,
        prefix: colors.cyan('~'),
        suffix: `Have you set up a public key for bitbucket`
      },
      {
        name: 'username',
        type: 'input',
        message: `${colors.magenta('username')}: `,
        default: config.username || 'synthet1c',
        prefix: colors.cyan('~'),
        suffix: `Your bitbucket username`
      },
    ])
    .then(writeConfig)
  })
  .on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ deploy exec sequential')
    console.log('    $ deploy exec async')
    console.log()
  })

program.parse(process.argv)
