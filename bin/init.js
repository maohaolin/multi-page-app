const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const cmd = require('node-cmd');
const git = require('download-git-repo')
const fs = require('fs');

const templateUrl = 'https://github.com/maohaolin/multi-page-app-template.git';

module.exports = function(name) {

  co(generator(name));
}

function* generator(name) {
  const temp = {
    name: name,
    author: '',
    description: '',
    sass: true,
    preloadedModule: true
  };

  if (!temp.name) {
    temp.name = yield prompt(chalk.green('ProjectName: '));
    temp.author = yield prompt(chalk.green('Author: '));
    temp.description = yield prompt(chalk.green('Description: '));
    // temp.sass = yield prompt(chalk.green('Used sass:') + chalk.yellow('(Y/N) '));
    // temp.preloadedModule = yield prompt(chalk.green('Preloaded module:') + chalk.yellow('(Y/N) '));
    // temp.sass = boolEval(temp.sass);
    // temp.preloadedModule = boolEval(temp.preloadedModule);
    console.log(temp)
    loadTemplate(temp);
  }
}

async function loadTemplate(temp) {
  const down = await gitDownload(temp.name);
  const changePackage = await changeDownloadPackage(temp);
  process.exit(0);
}
function gitDownload(name) {
  return new Promise(resolve => {
    git(`direct:${templateUrl}`, name, {clone: true}, err => {
      if (err) {
        console.error(err);
        process.exit(0);
      } else {
        resolve();
      }
    });
  })
}

function changeDownloadPackage(temp) {
  return new Promise(resolve => {
    const fileUrl = `./${temp.name}/package.json`;
    fs.readFile(fileUrl, (err, data) => {
      if (err) {
        console.error(err);
        process.exit(0);
      } else {
        const res = Object.assign({}, JSON.parse(data), {
          name: temp.name,
          description: temp.description,
          author: temp.author
        });
        fs.writeFile(fileUrl, JSON.stringify(res), err => {
          if (err){
            console.error(err);
            process.exit(0);
          } else {
            resolve();
          }
        })
      }
    });
  })
}

function boolEval(bool) {
  let b = null;
  if (!bool)
    b = false;
  else {
    if (bool.toUpperCase().replace(/\s/g, '') === 'N') {
      b = false;
    } else b = true;
  }
  return b;
}