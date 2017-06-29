const chalk       = require('chalk');
const clear       = require('clear');
const CLI         = require('clui');
const figlet      = require('figlet');
const Spinner     = CLI.Spinner;
const lib         = require('./src');
const prompt      = require('./src/prompt.js')

clear();
console.log(
    chalk.cyan(
        figlet.textSync('Cloud CMS', { horizontalLayout: 'full' })
    )
);
spinner = new Spinner('Connecting to Cloud CMS');
spinner.start()
const branch = lib.Init(function(err, branch){
    branch.then(function(){
        spinner.stop();
        console.log(chalk.green('------------------------'))
        console.log(chalk.green(' Connected to Cloud CMS '));
        console.log(chalk.green('------------------------'))
        console.log(chalk.green(''))
        prompt.ask(this);
    });
})