'use strict'

const util = require('../util.js');

module.exports = (req, res, next) => {
    if(Object.keys(res).indexOf('data') != -1){
        //Building the breadcrumb array and sorting it
        const array = util.parseBreadcrumb(util.parentsToTree(res.data.breadcrumb.items, res.data.item[0].parent_doc)).reverse();
        // Generate path value for each items
        res.data.breadcrumb = util.addBreadcrumbPath(array, res.data.item[0]); 

    }
    next();
}