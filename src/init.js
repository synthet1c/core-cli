const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const exec = require('child_process').exec
const installModule = require('./install-module')

module.exports = function() {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'site_name',
        message: 'What\'s the site url',
        filter: x => x.replace(/(^www\.|[^a-z0-9]+)/g, '')
      },
      {
        type: 'checkbox',
        message: 'Which modules would you like to install',
        name: 'modules',
        choices: [
          { name: 'pages' },
          { name: 'blogs' },
          { name: 'prodcatalogue' },
          { name: 'news' },
          { name: 'events' },
        ],
      },
      {
        type: 'list',
        message: 'Which modules would you like to install',
        name: 'build_system',
        choices: [
          { name: 'webpack' },
          { name: 'gulp' },
          { name: 'grunt', disabled: 'Oh hellz no' },
        ],
        validate: function(answer) {
          if (answer.length < 1) {
            return 'You must choose a build system.'
          }
          return true
        }
      },
    ])
    .then(answers => {
      // clone the base repo
      const command = `git clone https://github.com/synthet1c/core-base.git ${answers.site_name}`
      exec(command, function(error, stdout, stderr) {
        if (error) console.log("exec error: " + error)
        if (stdout) console.log("Result: " + stdout)
        if (stderr) console.log("shell error: " + stderr)
        // install any the required modules
        const promises = answers.modules.map(
          module => installModule(module, `${answers.site_name}/modules`)
        )
        Promise.all(promises)
          .then(result => console.log(result))
          .catch(error => console.log(error))
      })
    })
}
