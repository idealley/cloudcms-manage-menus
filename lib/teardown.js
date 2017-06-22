'use strict'

const util = require('./util.js')

module.exports = {
    teardown: (branch, nodes) => {
        Chain(branch).then(function() {
            nodes.map(n => {
                util.del(branch, n);
            })
        })
    }
};

