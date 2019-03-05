#! /usr/bin/env node

let program = require('commander');
let package = require('./package.json');
let init = require('./bin/init');
// let list = require('./bin/list');

program
  .version(package.version)
  .usage('<command> [options]');

program.command('init [name]')
  .description('Create a app')
  .action(function(name) {
    init(name);
  });

program.command('module [name]')
  .description('Create a module')
  .action(function(name) {
  });


program.parse(process.argv);
if(program.args.length==0) {
  //这里是处理默认没有输入参数或者命令的时候，显示help信息
  program.help();
}