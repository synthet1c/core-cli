const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const exec = require('child_process').exec
const installModule = require('./install-module')

module.exports = function installBase(siteName, isFork = false) {
  // clone the base repo
  return new Promise((res, rej) => {

    const command = isFork
      ? `git clone git@bitbucket.org:synthet1c/${siteName}.git`
      : `git clone git@bitbucket.org:synthet1c/core-base.git ${siteName}` 

    exec(command, function(error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error)
        return rej(error)
      } 
      res(stdout || stderr)
    })
  })
  .catch(console.log.bind(console))
}
