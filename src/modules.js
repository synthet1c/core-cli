module.exports = {
  "account": "synthet1c",
  "paths": {
    "modules": "/modules",
    "packages": "/packages",
    "build": "/build",
    "javascripts": {
      "src": "/javascripts/src",
      "dist": "/javascripts/dist"
    } 
  },
  "packages": {
    "core-blog": "core-blog.git",
    "core-catalogue": "core-blog.git",
    "core-component-1": "core-component.git",
    "core-component-2": "core-component.git"
  },
  "modules": {
    "prodcatalogue": {
      "module": "core-catalogue",
      "packages": [
        "core-component-1" 
      ]
    },
    "blogs": {
      "module": "core-blog",
      "packages": [
        "core-component-2" 
      ]
    },
  },
  prodcatalogue: {
    repo: 'git@bitbucket.org:synthet1c/core-blog.git',
    repoName: 'core-blog',
    module: 'prodcatalogue',
    modulePath: 'modules/prodcatalogue',
    componentsPath: 'modules/prodcatalogue/components',
    packagePath: 'packages',
    packages: {
      'core-component': 'git@bitbucket.org:synthet1c/core-component.git'
    }
  },
  blogs: {
    repo: 'git@bitbucket.org:synthet1c/core-blog.git',
    repoName: 'core-blog',
    module: 'blogs',
    modulePath: 'modules/blogs',
    componentsPath: 'modules/blogs/components',
    packagePath: 'packages',
    packages: {
      'core-component': 'git@bitbucket.org:synthet1c/core-component.git'
    }
  }
}
