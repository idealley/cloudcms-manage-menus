'use strict'

const util = require('../util.js');

module.exports = (req, res, next) => {
    if(Object.keys(res).indexOf('data') != -1){
        res.data.items = util.parse(util.childrenToTree(res.data.items, res.data.item._doc));
    }
    next();
}