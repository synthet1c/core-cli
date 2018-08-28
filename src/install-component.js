const exec = require('child_process').exec
const modules = require('./modules')

module.exports = function(module, component) {
  return new Promise((res, rej) => {
    // check if the provided module is allowed
    if (typeof modules[module] === 'undefined') {
      throw new Error(`module ${module} not alowed`)
    }
    // check if the provided component is allowed
    if (typeof modules[module].components[component] === 'undefined') {
      throw new Error(`component ${component} not alowed`)
    }

    const command = [
      `git subtree add`,
      `--prefix packages/${module}/${component}`,
      `${modules[module].component[component]} master --squash`
    ].join(' ')

    exec(command, function(error, stdout, stderr) {
      if (error) rej(error)
      if (stdout) console.log("Result: " + stdout)
      if (stderr) console.log("shell error: " + stderr)
      res(stdout || stderr)
    })
  })
}
