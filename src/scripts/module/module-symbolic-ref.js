const program = require('commander')
const exec = require('child_process').exec

// from atlassian video
program
  // .command('module symbolic-ref <sha1>')
  .command('symbolic-ref <sha1>')
  .description('Find the symbolic ref matching a hash (sha-1)')
  .action(function(sha1) {
    const command = `git ls-remote https://bitbucket.org/synthet1c/core-base.git | grep ${sha1}`
    exec(command, function(error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error)
      } 
      console.log(stdout || stderr)
    })
  })


