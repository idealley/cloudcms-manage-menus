'use strict'

const gitana = require("gitana");

module.exports = {
    //@todo add param for branches
    init: cb => {
        return gitana.connect(function(err) {

            if (err) {
                console.log("");
                console.log("There was a problem connecting to Cloud CMS");
                console.log(err);
            }

            // read the master branch
            this.datastore("content").readBranch("master").then(function() {
                    return cb(null,this);
                })
        });
        
    }
  
}