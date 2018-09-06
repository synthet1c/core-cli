const exec = require('child_process').exec
const { modules, packages } = require('./modules')
const { getRepoUrl } = require('./utils')

module.exports = function(module, siteName) {
  return new Promise((res, rej) => {
    
    if (typeof modules[module] === 'undefined') {
      throw new Error(`module ${module} not alowed`)
    }

    if (typeof packages[modules[module].module] === 'undefined') {
      throw new Error(`package ${packages[modules[module].module]} not alowed: ${module}|${modules[module].module}`)
    }

    console.log(`install module: ${module}`)
    const command = [
      siteName ? `cd ${siteName} &&` : ``,
      `git subtree add`,
      `--prefix modules/${module}`,
      `${getRepoUrl(packages[modules[module].module])} master --squash`
    ].join(' ')

    exec(command, function(error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error)
        return rej(error)
      } 
      res(stdout || stderr)
    })
  })
}
