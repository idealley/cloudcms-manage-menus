
const express = require('express');
const path = require('path');
const gitana = require("gitana");

const r = require('./src/requests.js');
const util = require('./src/util.js');

// Loading Middlwares
const menuParser = require('./src/middleware/menuParser.js');
const breadcrumbParser = require('./src/middleware/breadcrumbParser.js');

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
            console.log("   To view the sample menu, go to http://localhost:" + server.address().port + "/main-menu");
            console.log("");
        });


    });
});

const bindControllers = function(branch, app)
{   

    app.get('/main-menu', (req, res, next) => {
        r.item(branch, 'main-menu').then(data => {
            r.menuItems(branch, data.item[0]._qname).then(data => {
                res.data = data;
                next()
            }).catch(() => {});
        }).catch(() => {});
    }, menuParser, (req, res, next) => {
            res.render('index', { menu: res.data });
            //res.json(res.data);
    });


    app.get('*', (req, res, next) => {
        const slug = req.path.split('/').slice(-1)[0];
        r.item(branch, slug).then(data => {
            r.breadcrumb(branch, data.item[0]._qname).then(d => {
                data.breadcrumb = d;
                res.data = data;

                if(data.item[0]._statistics['a:category-association'] > 0){
                    r.relatives(branch, data.item[0]._qname).then(d => {
                        data.items = d;
                        res.data = data;
                        next();
                    }).catch(() => {});
                } else {next();}    

            }).catch(() => {});;
        }).catch(() => {});
    }, breadcrumbParser, (req, res, next) => {
        res.render('page', { data: res.data });
        //res.json(res.data);
    });    


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