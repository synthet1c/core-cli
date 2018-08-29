const exec = require('child_process').exec
const modules = require('./modules')

module.exports = function(module, siteName) {
  return new Promise((res, rej) => {
    
    if (typeof modules[module] === 'undefined') {
      throw new Error(`module ${module} not alowed`)
    }

    const config = modules[module]

    const command = [
      siteName ? `cd ${siteName} &&` : ``,
      `git subtree add`,
      `--prefix modules/${config.module}`,
      `${config.repo} master --squash`
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
