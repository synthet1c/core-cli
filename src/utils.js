const { readConfig } = require('./scripts/base/config')
const config = readConfig()

// executed promises sequencially
const sequence = funcs =>
  funcs.reduce((promise, func) =>
    promise.then(
      result => func(result).then(Array.prototype.concat.bind(result))
    ), 
    Promise.resolve([])
  )

const bitbucketUrl = config.ssh 
  ? 'git@bitbucket.org:' 
  : 'https://bitbucket.org/'

const bitbucketAccount = config.account
  ? config.account
  : 'synthet1c'

const getRepoUrl = repo => 
  `${bitbucketUrl}${bitbucketAccount}/${repo}`

exports.sequence = sequence
exports.getRepoUrl = getRepoUrl
  
