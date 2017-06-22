'use strict'

const inquirer    = require('inquirer');
const lib         = require('../lib');
const nodes       = require('./nodes.js')

const self = module.exports = {
    ask: branch => {
        inquirer.prompt([
        {
            type: 'list',
            message: 'What do you want to do?',
            name: 'tutorial',
            choices: [
            {
                name: 'Setup Cloud CMS for the tutorial',
                value: 'setup',
                checked: true
            },
            {
                name: 'Import sample content',
                value: 'content'
            },
            {
                name: 'Remove sample content',
                value: 'teardown-content'
            },
            {
                name: 'Remove sample setup',
                value: 'teardown-setup'
            }
            ],
            validate: answer => {
            if (answer.length < 1) {
                return 'You must choose at least one answer.';
            }
            return true;
            }
        }
        ]).then(answers => {
            if( ['setup', 'content'].indexOf(answers.tutorial) != -1){
                lib.Setup.setup(branch, nodes[answers.tutorial])
            }

            if(answers.tutorial.split('-')[0] == 'teardown'){
                lib.Teardown(branch, nodes[answers.tutorial.split('-')[1]]);
            }
        });
    }
} 