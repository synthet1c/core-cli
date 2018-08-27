const program = require('commander')
const inquirer = require('inquirer')
const modules = require('../../modules')
const installPackage = require('../../install-package')

program
  .command('package-install [module] [packages...]')
  .description('install a component using git subtree')
  .action(function(module, packages) {
    const install = ({ module, packages }) => {
      console.log('packages', module, packages, modules)
      const promises = packages.map(
        package => installPackage(module, package)
      )
      Promise.all(promises)
        .then((results) => {
          console.log(`installed all ${packages.join()}`)
        })
        .catch((error) => {
          console.error(error) 
        })
    }
    if (module && packages) {
      return install({ module, packages }) 
    }
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which module would you like to install a package in',
        name: 'module',
        choices: Object.keys(modules) 
      },
      {
        type: 'checkbox',
        message: 'Which packages would you like to install',
        name: 'packages',
        choices: ({ module }) => Object.keys(modules[module].packages) 
      }
    ]).then(install)
  })


