const exec = require('child_process').exec
const packages = require('./modules').packages

module.exports = function(package, siteName) {
  console.log(`package`, package, packages[package], packages)
  return new Promise((res, rej) => {
    

    // check if the provided component is allowed
    if (typeof packages[package] === 'undefined') {
      throw new Error(`package ${package} not alowed`)
    }

    console.log(`package`, package, packages[package])

    const command = [
      siteName ? `cd ${siteName} &&` : ``,
      `git subtree add`,
      `--prefix packages/${package}`,
      `git@bitbucket.org:synthet1c/${packages[package]} master --squash`
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

