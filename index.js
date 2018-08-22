#!/usr/bin/env node

const program = require('commander')
const exec = require('child_process').exec
const inquirer = require('inquirer')
const init = require('./init')
const modules = require('./modules')
const installModule = require('./install-module')
const installComponent = require('./install-component')

const repositories = {
  pages: 'https://github.com/synthet1c/core-pages.git',
  prodcatalogue: 'https://github.com/synthet1c/core-prodcatalogue.git',
}

program
  .command('init')
  .description('initialize a project')
  .action(init)
 
program
  .command('pull')
  .description('test querying git')
  .action(function() {
    console.log('inited')
    exec('git pull', function(error, stdout, stderr) {
      if (error) console.log("exec error: " + error)
      if (stdout) console.log("Result: " + stdout)
      if (stderr) console.log("shell error: " + stderr)
    })
  })

program
  .command('install')
  .description('install a module from git')
  .action(function() {
    
    const command = [
      `cd modules`,
      `git clone --depth=1 https://github.com/synthet1c/core-blog.git core-blog`,
      `rm -rf !$/.git`,
      `rm !$/.gitignore`
    ].join(' && ')

    exec(command, function(error, stdout, stderr) {
      if (error) console.log("exec error: " + error)
      if (stdout) console.log("Result: " + stdout)
      if (stderr) console.log("shell error: " + stderr)
    })
  })

program
  .command('subtree <module> [component...]')
  .description('install a component using git subtree')
  .action(function(module, components) {
    console.log('fnc', installComponent)
    const promises = components.map(
      component => installComponent(module, component)
    )
    Promise.all(promises)
      .then((results) => {
        console.log(`installed all ${components.join()}`)
      })
      .catch((error) => {
        console.error(error) 
      })
  })

program
  .command('args <module> [component...]')
  .description('test arguments')
  .action(function(module, args) {
    console.log('args', module, JSON.stringify(args))
  })

program.parse(process.argv)
