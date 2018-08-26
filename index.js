#!/usr/bin/env node
// create a sequential list of tasks
// https://github.com/SamVerschueren/listr
const program = require('commander')
const exec = require('child_process').exec
const inquirer = require('inquirer')
const init = require('./init')
const modules = require('./modules')
const installFork = require('./install-fork')
const installBase = require('./install-base')
const installModule = require('./install-module-subtree')
const installPackage = require('./install-package')
const installComponent = require('./install-component')
const getBranches = require('./get-branches')
const fetch = require('node-fetch')
const btoa = require('btoa')
const { sequence } = require('./utils')

const repositories = {
  pages: 'https://github.com/synthet1c/core-pages.git',
  prodcatalogue: 'https://github.com/synthet1c/core-prodcatalogue.git',
}

/*
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
*/

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
  .command('module')
  .description('install a module')
  .action(function() {
    inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Which modules would you like to install',
        name: 'modules',
        choices: Object.keys(modules) 
      }
    ])
    .then(answers => {
      console.log('module', answers.modules) 
      const promises = answers.modules.map(
        module => installModule(module)
      )
      Promise.all(promises)
        .then(results => {
          console.log(`installed modules ${answers.modules.join()}`)
        })
        .catch((error) => {
          console.error(error) 
        })
    })
  })

program
  .command('list')
  .description('test arguments')
  .action(function(module, args) {
    const command = `git log | grep git-subtree-dir | tr -d ' ' | cut -d ":" -f2 | sort | uniq`
    exec(command, function(error, stdout, stderr) {
      if (error) rej(error)
      if (stdout) console.log(stdout)
      if (stderr) console.log("shell error: " + stderr)
    })
  })

// from atlassian video
program
  .command('symbolic-ref <sha1>')
  .description('Find the symbolic ref matching a hash (sha-1)')
  .action(function(sha1) {
    const command = `git ls-remote https://bitbucket.org/synthet1c/${repo}.git | grep ${sha1}`
    exec(command, function(error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error)
      } 
      console.log(stdout || stderr)
    })
  })

program
  .command('update [module] [branch]')
  .description('Pull a subtree module')
  .action(function(module, branch) {
    const pullModule = ({ module, branch = 'master' }) => {
      const config = modules[module]
      console.log('config', config)
      const command = `git subtree pull --prefix ${config.modulePath} ssh://${config.repo} ${branch}`
      exec(command, function(error, stdout, stderr) {
        if (error) {
          console.log("exec error: " + error)
        } 
        console.log(stdout || stderr)
      })
    }
    // if module is provided use it
    if (module && typeof modules[module] !== 'undefined') {
      return pullModule({ module, branch }) 
    }
    // if no module is provided get the user to enter it
    inquirer.prompt([
      {
        name: 'module',
        type: 'list',
        message: 'Which module would you like to pull from',
        choices: Object.keys(modules),
        validate: answers => answers.length || 'You must choose a module.',
      },
      {
        name: 'branch',
        type: 'list',
        message: 'Which branch would you like to pull from',
        choices: answers => 
          getBranches(modules[answers.module].repoName)
      }
    ]).then(function({ module, branch }) {
      console.log('then', module, branch)
      pullModule({ module, branch })
    })

  })

program
  .command('contribute [module] [branch]')
  .description('Pull a subtree module')
  .action(function(module) {
    
    const contribute = ({ module, branch = 'master' }) => {
      const config = modules[module]
      console.log('config', config)
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
      console.log('then', module, branch)
      contribute({ module, branch })
    })
  })

program
  .command('init')
  .description('init a new site')
  .action(function() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'site_name',
        message: 'What\'s the site url',
        // validate: x => /www\.\w+/.test(x) || 'please provide the full url eg www.site.com',
        filter: x => x.replace(/(^www\.|[^a-z0-9]+)/g, ''),
      },
      {
        type: 'confirm',
        name: 'should_fork',
        message: 'Do you want to create your own fork',
        default: false,
      },
      {
        type: 'confirm',
        name: 'make_private',
        message: 'Do you want the fork to be private',
        default: true,
        when: answers => answers.should_fork
      },
      // list all modules
      {
        type: 'checkbox',
        message: 'Which modules would you like to install',
        name: 'modules',
        choices: Object.keys(modules),
      },
      // list all packages from each module
      ...Object.keys(modules).map(module => ({
        // only display the question if the module has been included
        when: answers => answers.modules.includes(module),
        type: 'checkbox',
        message: `[${module.toUpperCase()}] Features`,
        name: `packages.${module}`,
        choices: Object.keys(modules[module].packages)
      })),
      {
        type: 'list',
        message: 'What build system do you use',
        name: 'build_system',
        choices: [
          { name: 'webpack' },
          { name: 'gulp' },
          { name: 'grunt', disabled: 'Oh hellz no' },
        ],
        validate: answers => answers.length || 'You must choose a build system.',
      },
    ])
      .then(answers => (console.log('answers', answers), answers))
      .then(({ site_name, modules, packages, should_fork, make_private }) => {
        const modulePromises = modules.map(
          module => () => installModule(module, site_name)
        )
        const packagePromises = modules.reduce((acc, module) => 
          acc.concat(packages[module].map(
            package => () => installPackage(module, package, site_name))
          )
        , [])
        sequence([
          x => { 
            console.log('intalling fork'); 
            return should_fork ? 
              installFork(site_name, make_private) : 
              Promise.resolve(x)
          },
          x => { 
            console.log('intalling site'); 
            return installBase(site_name, should_fork)
          },
          x => { 
            console.log('installing modules'); 
            return Promise.resolve(x) 
          },
          ...modulePromises,
          x => { 
            console.log('installing packages'); 
            return Promise.resolve(x) },
          ...packagePromises,
          x => { 
            console.log('all done'); 
            return Promise.resolve(x) 
          },
        ])

      })
  })


program.parse(process.argv)
