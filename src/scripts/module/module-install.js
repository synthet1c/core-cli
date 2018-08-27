const inquirer = require('inquirer')
const program = require('commander')
const installModule = require('../../install-module-subtree')
const modules = require('../../modules')

program
  .command('install [modules..]')
  // .command('module install [modules..]')
  .description('install a module')
  .action(function(cliModules) {

    const doInstall = ({ cliModules }) => {
      console.log('cliModules', cliModules)
      const promises = cliModules.map(
        module => installModule(module)
      )
      Promise.all(promises)
        .then(results => {
          console.log(`installed modules ${cliModules.join()}`)
        })
        .catch((error) => {
          console.error(error) 
        })
    }

    if (cliModules) {
      cliModules.forEach(x => {
        if (!modules[x])
          throw new Error(`module ${x} in not valid`)
      })
      return doInstall({ cliModules }) 
    }

    inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Which modules would you like to install',
        name: 'cliModules',
        choices: Object.keys(modules) 
      }
    ])
    .then(doInstall)
  })
