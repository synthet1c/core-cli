const inquirer = require('inquirer')
const fetch = require('node-fetch')
const btoa = require('btoa')

module.exports = function installBase(siteName, make_private = false) {
  const url = `https://api.bitbucket.org/2.0/repositories/synthet1c/core-base/forks`
  return fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Basic ` + btoa('synthet1c:synthet1c')
    },
    body: JSON.stringify({
      name: siteName,
      is_private: make_private
    })
  })
  .then(response => response.json())
  .catch(error => console.log('error', error))
}
