const exec = require('child_process').exec
const modules = require('./modules')

module.exports = function(module, package, siteName) {
  return new Promise((res, rej) => {
    
    if (typeof modules[module] === 'undefined') {
      throw new Error(`module ${module} not alowed`)
    }
    const config = modules[module]
    const packages = config.packages
    // check if the provided component is allowed
    if (typeof packages[package] === 'undefined') {
      throw new Error(`package ${package} not alowed`)
    }

    const command = [
      siteName ? `cd ${siteName} &&` : ``,
      `git subtree add`,
      `--prefix modules/${module}/packages/${package}`,
      `${packages[package]} master --squash`
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

