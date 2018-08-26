const inquirer = require('inquirer')
const fetch = require('node-fetch')
const btoa = require('btoa')

module.exports = function getBranches(repo) {
  console.log(`retrieving branch info ${repo}`)
  const url = `https://api.bitbucket.org/2.0/repositories/synthet1c/${repo}/refs/branches`
  return fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Basic ` + btoa('synthet1c:synthet1c')
    },
  })
  .then(response => response.json())
  .then(response => response.values.map(branch => branch.name))
  .catch(error => console.log('error', error))
}
