const program = require('commander')
const inquirer = require('inquirer')
const modules = require('../../modules')
const installFork = require('../../install-fork')
const installBase = require('../../install-base')
const installModule = require('../../install-module-subtree')
const installPackage = require('../../install-package')
const { sequence } = require('../../utils')

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


