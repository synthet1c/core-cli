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
  .command('test')
  .description('Task runner')
  .action(function() {
    console.log('process', process.env)
  })

program.parse(process.argv)
