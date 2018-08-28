const program = require('commander')
const exec = require('child_process').exec

program
  // .command('module list')
  .command('module-list')
  .description('List all subtree modules installed in your site')
  .action(function(module, args) {
    const command = `git log | grep git-subtree-dir | tr -d ' ' | cut -d ":" -f2 | sort | uniq`
    exec(command, function(error, stdout, stderr) {
      if (error) rej(error)
      if (stdout) console.log(stdout)
      if (stderr) console.log("shell error: " + stderr)
    })
  })


