const exec = require('child_process').exec
const modules = require('./modules')

module.exports = function(module, installPath = 'modules') {
  return new Promise((res, rej) => {
    
    if (typeof modules[module] === 'undefined') {
      throw new Error(`module ${module} not alowed`)
    }

    const command = [
      `git clone --depth=1 ${modules[module].repo} ${installPath}/${modules[module].repoName}`,
      `rm -rf !$/.git`,
      `rm !$/.gitignore`
    ].join(' && ')

    exec(command, function(error, stdout, stderr) {
      if (error) console.log("exec error: " + error)
      if (stdout) console.log("Result: " + stdout)
      if (stderr) console.log("shell error: " + stderr)
    })
  })
}
