/**
 * Hello World (Express)
 *
 * This Hello World example improves upon the basic Hello World project (in a different directory) by using Express
 * to host a simple web server application.  The web application offers three functions:
 *
 *    a) Create 3 content items
 *    b) Query for content items and display them
 *    c) Delete content items
 *
 * The purpose of this project is to get a better sense of the CRUD operations that Cloud CMS supports.  We can not
 * only query for content, but we can also create it, delete it and work with it in result sets.
 *
 * Jade is used as a templating engine and Express is kept in a pretty minimal configuration.
 *
 * See the README.md file for more information.
 */

const express = require('express');
const path = require('path');
const gitana = require("gitana");

const r = require('./lib/requests.js');
const util = require('./lib/util.js');

// Loading Middlwares
const menuParser = require('./middleware/menuParser.js');
const breadcrumbParser = require('./middleware/breadcrumbParser.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

// connect to Cloud CMS
// this looks for gitana.json in local directory
gitana.connect(function(err) {

    if (err) {
        console.log("");
        console.log("There was a problem connecting to Cloud CMS");
        console.log(err);
        process.exit();
    }

    // read the master branch
    this.datastore("content").readBranch("master").then(function() {

        // bind controllers
        bindControllers(this, app);

        // start web server
        app.set('port', process.env.PORT || 3000);
        const server = app.listen(app.get('port'), function() {
            console.log("");
            console.log("---------------------------------------------------------");
            console.log("Hello World (Express) is alive and kicking!");
            console.log("");
            console.log("   To view sample menu, go to http://localhost:" + server.address().port + "/");
            console.log("");
        });


    });
});

const bindControllers = function(branch, app)
{   

    app.use(menuParser);
    app.get('/:slug', (req, res, next) => {

        r.item(branch, req.params.slug).then(data => {
            r.menuItems(branch, data.item[0]._qname).then(data => {
                res.data = data;
                next()
            }).catch(() => {});;
        }).catch(() => {});;
    }, menuParser, (req, res, next) => {
            res.render('index', { menu: res.data });
        });

    app.get('/child-2/:slug', (req, res, next) => {
        const slug = req.params.slug;
        r.item(branch, slug).then(data => {
            r.breadcrumb(branch, data.item[0]._qname).then(d => {
                data.breadcrumb = d;
                res.data = data;
                next();
            }).catch(() => {});; 
        }).catch(() => {});
    }, breadcrumbParser, (req, res, next) => {
        res.render('page', { data: res.data });
        //res.json(res.data);
    });

    app.get('/child-1/:slug', (req, res, next) => {
        r.item(branch, req.params.slug).then(data => {
            r.breadcrumb(branch, data.item[0]._qname).then(d => {
                data.breadcrumb = d;
                res.data = data;
                next();
            }).catch(() => {});      
        }).catch(() => {});
    }, breadcrumbParser, (req, res, next) => {
        res.render('page', { data: res.data });
        //res.json(res.data);
    });

    app.get('/child-1/child-of-child-1/:slug', (req, res, next) => {
        r.item(branch, req.params.slug).then(data => {
            r.breadcrumb(branch, data.item[0]._qname).then(d => {
                data.breadcrumb = d;
                res.data = data;
                next();
            }).catch(() => {});
        }).catch(() => {});
    }, breadcrumbParser, (req, res, next) => {
        res.render('page', { data: res.data });
        //res.json(res.data);
    })

    // catch 404
    app.use((req, res, next) => {
        res.json({error:{
            message: "Page not found!",
            error: {status:404, stack:""}
        }});
    });

    // error handlers
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({error: {
            message: err.message,
            error: err
        }});
    });
};