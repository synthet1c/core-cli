const program = require('commander')
const modules = require('../../modules')
const installComponent = require('../../install-component')

program
  .command('package-install <package> [components...]')
  .description('install a component using git subtree')
  .action(function(package, components) {
    const promises = components.map(
      component => installComponent(package, component)
    )
    Promise.all(promises)
      .then((results) => {
        console.log(`installed all ${components.join()}`)
      })
      .catch((error) => {
        console.error(error) 
      })
  })


