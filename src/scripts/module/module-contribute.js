#!/usr/bin/env node
const exec = require('child_process').exec
const inquirer = require('inquirer')
const program = require('commander')
const modules = require('../../modules')
const getBranches = require('../../get-branches')

program
  // .command('module contribute [module] [branch]')
  .command('module-contribute [module] [branch]')
  .description('Pull a subtree module')
  .action(function(module) {
    
    const contribute = ({ module, branch = 'master' }) => {
      const config = modules[module]
      const command = `git subtree push --prefix ${config.modulePath} ssh://${config.repo} ${branch}`
      exec(command, function(error, stdout, stderr) {
        if (error) {
          console.log("exec error: " + error)
        } 
        console.log(stdout || stderr)
      })
    }
    // if module is provided use it
    if (module && typeof modules[module] !== 'undefined') {
      return contribute({ module }) 
    }
    // if no module is provided get the user to enter it
    inquirer.prompt([
      {
        name: 'module',
        type: 'list',
        message: 'Which modules would you like to push to',
        choices: Object.keys(modules),
        validate: answers => answers.length || 'You must choose a module.',
      },
      {
        name: 'branch',
        type: 'list',
        message: 'Which branch would you like to push to',
        choices: answers => 
          getBranches(modules[answers.module].repoName)
      }
    ]).then(function({ module, branch }) {
      contribute({ module, branch })
    })
  })
