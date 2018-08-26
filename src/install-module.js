const exec = require('child_process').exec
const modules = require('./modules')

module.exports = function(module, installPath = 'modules') {
  return new Promise((res, rej) => {
    
    if (typeof modules[module] === 'undefined') {
      throw new Error(`module ${module} not alowed`)
    }

    const config = modules[module]

    const command = [
      `git clone --depth=1 ${config.repo} ${installPath}/${config.module}`,
      `rm -rf ${installPath}/${config.repo}`,
      // `rm !$/.gitignore`
    ].join(' && ')

    exec(command, function(error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error)
        return rej(error)
      } 
      res(stdout || stderr)
    })
  })
}
