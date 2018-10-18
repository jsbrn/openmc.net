const path = require('path')
//load express
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
//load database
//const database = require('./app/database.js');
//define server instance with 'http' module, passing in the express instance
const server = require('http').createServer(app);
//load and init socket.js using the socketIO instance, which is created using the above http server instance
const socket = require("./app/socket.js");
socket.init(require('socket.io')(server));

/*Set the Handlebars options*/
app.engine('.hbs', exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

/*Set locations for getting static content*/
app.use('/assets',express.static(path.join(__dirname, 'views/assets')));
app.use('/images',express.static(path.join(__dirname, 'views/assets/images')));
app.use('/css',express.static(path.join(__dirname, 'views/assets/stylesheets')));
app.use('/scripts',express.static(path.join(__dirname, 'views/assets/scripts')));
app.use('/audio',express.static(path.join(__dirname, 'views/assets/audio')));
app.use('/common',express.static(path.join(__dirname, 'app/common')));

/*HTTP REQUEST HANDLERS*/

app.get('/', (request, response) => {
    response.render("about", {
        layout: "main"
    });
});

app.get('/about', (request, response) => {
    response.render("about", {
        layout: "main"
    });
});

app.get('/updates', (request, response) => {
    response.render("updates", {
        layout: "main"
    });
});

app.get('/players', (request, response) => {
    response.render("players", {
        layout: "main"
    });
});

app.get('/membership', (request, response) => {
    response.render("membership", {
        layout: "main"
    });
});

app.get('/stats', (request, response) => {
    response.render("stats", {
        layout: "main"
    });
});

app.get('/contact', (request, response) => {
    response.render("contact", {
        layout: "main"
    });
});

app.post('/contact/submit', (request, response) => {
    response.render("contact", {
        layout: "main"
    });
});

//catchall and 404
app.get('*', (request, response) => {
    response.render("404", {});
});

/*LAUNCH THE HTTP SERVER ON PORT 80*/
const port = 80;
server.listen(port, function(err) {
    if (err) console.log("An error occurred.");
    console.log("Server started on port "+port);
});