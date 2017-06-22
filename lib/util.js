'use strict'

const chalk  = require('chalk');

const self = module.exports =  {
    del: (branch, node) => {
        Chain(branch)
            .trap(function(err) {
                console.log('');
                console.log(chalk.red("Something went wrong: "));
                console.log(err.message);
                console.log('');
            })
            .then(function(){
                const b = this;
                if(Object.keys(node).indexOf('_qname') == -1){
                    self.getQname(branch, node, function(err, qname){
                        if(qname.length > 0) {
                            node._qname = qname;
                            self.del(b, node);
                        }
                        if(err){
                            console.log(chalk.yellow(node.title, ':', err));
                        }      
                    })
                } else {       
                    b.queryNodes({
                        _qname: node._qname
                    }).del().then(function(){
                        console.log('deleted: ', node.title)
                    })
                }
            })  
    },

    getQname: (branch, node, cb) => {
        Chain(branch).then(function(){
            this.queryNodes({
                slug: node.slug
            })
            .each(function(){
                this._qname = this.__qname();
            })
            .then(function(){
                if(this.asArray().length > 0) {
                    return cb(null, this.asArray()[0]._qname)
                }

                return cb('node already deleted', '');
                
            })
        })
    },

    toTreeChildren: (items, rootId) => {
        let tree = [];
        items.map(i => {
            if(i.parent.id == rootId && i.type == 'visible') {
                const children = self.toTreeChildren(items, i._doc)
                if(children.length){
                    i.children = children
                }
                tree.push(i)
            }
        });
        return tree;
    },

    toTreeParent: (items, startId) => {
        let tree = []
        items.map(i => {

            if(i._doc == startId && !i.root) {
                const parent = self.toTreeParent(items, i.parent.id)
                if(parent.length){
                    i.path = parent;
                }
                tree.push(i)
            }
        })

        return tree;
    },

    parseBreadcrumb: (path) => {
        return path.reduce((acc, x, k, a) => {
            const {title, slug} = x;
            const childSlug = x[x.contentType].slug;
            acc = acc.concat({title, slug, childSlug });
            if (x.path) {
                acc = acc.concat(self.parseBreadcrumb(x.path));
                x.path = [];
            }
            return acc;
        }, []);
    },

    addBreadcrumbPath: (array, item) => {
        const len = array.length;
        return array.map((i, k) => {
            let path = array.slice(0, k + 1);
            i.path = path.map(i => `/${i.slug}/${i.childSlug}`).join('');
            if(k + 1 == len){
                i.article = {
                    tilte: item.title,
                    slug: item.slug,
                    path:i.path + `/${item.slug}`
                    
                };
            }
            return i;
        });
    },

    parse: (items, path) => {
        path = path || '';
        return items.map(i => {
            const keys = Object.keys(i)
            if(keys.indexOf(i.contentType) !== -1){
                    i.path = path + `/${i.slug}/${i[i.contentType].slug}`;
                
            }

            if(keys.indexOf('children') !== -1 ){
                self.parse(i.children, i.path.split('/').slice(0, -1).join('/'));
                if(keys.indexOf('ordering')){
                    i.children = self.sortBy(i.children, i.ordering)               
                }
            }

            return i;
        });
    },

    sortBy: (items, method) => {
        if(method === 'order'){
            items.sort((a,b) => a.order - b.order);
        }

        if(method === 'a-z'){
            items.sort();
        }

        if(method === 'z-a'){
            items.sort().reverse();
        }
        return items
    },

    remove: (array, element) => {
        return array.filter(e => e !== element);
    }
}