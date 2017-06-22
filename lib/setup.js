'use strict';

const gitana = require("gitana");
const chalk  = require('chalk');
const CLI = require('clui');
const Progress = CLI.Progress;



module.exports = {
    setup: (branch, nodes) => {
        Chain(branch).then(function() {
            const branch = this;
            nodes.map((n, i) => {
                n.imported = true;
                Chain(branch)
                    .trap(function(err) {
                        console.log(chalk.red("Something went wrong: "));
                        console.log(err.message); 
                    })
                    .createNode(n).then(function(){
                        console.log('Created node: ', n.title);
                    }); 
            });
        });
    }
};