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

const writeConfig = (name, config) => fs.writeFileSync(name, JSON.stringify(config))

program
  .command('config')
  .description('Set your config')
  .action(function() {
    const configFileName = process.env.HOMEPATH + '/.coredna'
    // set the
    // check to see if the user has an ssh key using
    // ssh -T git@bitbucket.org
    // logged in:
    if (!fs.existsSync(configFileName)) {
      writeConfig(configFileName, {})
    }
    const config = JSON.parse(fs.readFileSync(configFileName, 'utf-8'))
    // get the config file from

    inquirer.prompt([
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
      .then(function(answers) {
        writeConfig(configFileName, answers)
      })


  })

program.parse(process.argv)
