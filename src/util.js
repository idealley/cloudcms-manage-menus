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

    childrenToTree: (items, rootId) => {
        let tree = [];
        items.map(i => {
            if(i.parent.id == rootId && i.type == 'visible') {
                const children = self.childrenToTree(items, i._doc)
                if(children.length){
                    i.children = children
                }
                tree.push(i)
            }
        });
        return tree;
    },

    parentsToTree: (items, startId) => {
        let tree = []
        items.map(i => {
            if(i._doc == startId && !i.root) {
                const parent = self.parentsToTree(items, i.parent.id)
                if(parent.length){
                    i.path = parent;
                }
                tree.push(i)
            }
        })
        return tree;
    },

    parseBreadcrumb: (path) => {
        return path.reduce((a, i) => {
            const {title, slug} = i;
            let childSlug = '';
            if(!i._stats['a:category-association_INCOMING']){
                childSlug = i[i.contentType].slug;
            }
            a = a.concat({title, slug, childSlug });
            if (i.path && !i._stats['a:category-association_INCOMING']) {
                a = a.concat(self.parseBreadcrumb(i.path));
                i.path = [];
            }
            return a;
        }, []);
    },

    addBreadcrumbPath: (array, item) => {
        const len = array.length;
        return array.map((i, k) => {
            let path = array.slice(0, k + 1);
            //Menu in path
            //i.path = path.map(i => `/${i.slug}/${i.childSlug}`).join('');
            i.path = path.map(i => `/${i.childSlug}`).join('');
            // if(k + 1 == len){
            //     i.article = {
            //         tilte: item.title,
            //         slug: item.slug,
            //         //Menu in path
            //         //path: i.path + `/${item.slug}`
            //         path: i.path
                    
            //     };
            // }
            return i;
        });
    },

    parse: (items, path) => {
        path = path || '';
        return items.map(i => {
            const keys = Object.keys(i)
            if(keys.indexOf(i.contentType) !== -1){
                    //Menu part of the url
                    //i.path = path + `/${i.slug}/${i[i.contentType].slug}`;  
                    // Menu not part of the url
                    i.path = path + `/${i[i.contentType].slug}`;          
            }

            if(keys.indexOf('children') !== -1 ){
                // Menu part of the URL
                // const p = i.path.split('/').slice(0, -1).join('/')
                // Menu not part of the URL
                const p = i.path;
                self.parse(i.children, p);
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