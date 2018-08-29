const inquirer = require('inquirer')
const program = require('commander')
const installModule = require('../../install-module-subtree')
const modules = require('../../modules')
const Listr = require('listr')

program
  .command('module-install [modules..]')
  // .command('module install [modules..]')
  .description('install a module')
  .action(function(cliModules) {

    const doInstall = ({ cliModules }) => {
      console.log('cliModules', cliModules)
      const promises = cliModules.map(
        module => ({
          title: `${module}`,
          task: () => installModule(module)
        }) 
      )
      const tasks = new Listr([
        {
          title: 'Install modules',
          task: () => new Listr(promises)
        }
      ])
      tasks.run()
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
