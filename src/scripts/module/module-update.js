const program = require('commander')
const exec = require('child_process').exec
const inquirer = require('inquirer')
const pullModule = require('../../install-module')
const getBranches = require('../../get-branches')
const modules = require('../../modules')

program
// .command('module update [module] [branch]')
  .command('module-update [module] [branch]')
  .description('Update a subtree module')
  .action(function(module, branch) {

    const pullModule = ({ module, branch = 'master' }) => {
      const config = modules[module]
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
    ]).then(pullModule)

  })
