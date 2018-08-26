require('./module-contribute')
require('./module-install')
require('./module-list')
require('./module-symbolic-ref')
require('./module-update')
const program = require('commander')

program
  .command('module', 'Install a module')
