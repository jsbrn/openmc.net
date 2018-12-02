const path = require('path');
//load express
const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const database = require('./app/database.js');
//load mailer
const mailer = require('./app/mailer.js');
//if not running on Now instance, require dotenv
//(reads environment variables from a .env file on the local repo)
if (process.env.NOW == undefined) require('dotenv').config()

/*Set the Handlebars options, including the Helpers*/
app.engine('.hbs', exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.join(__dirname, 'views/layouts'),
      helpers: {
          playerStatus: (player) => {
              console.log(JSON.stringify(player));
              var status = player.banned ? "banned" : (player.online ? "online" : "offline");
              status = status + (!player.member ? "-guest" : "");
              return status;
          },
          playerStatusDesc: (player) => {
                console.log(JSON.stringify(player));
                var status = (player.banned ? "Banned " : "") 
                    + (player.member ? "Member" : "Guest") 
                    + (player.online ? " (Online)" : " (Offline)");
                return status;
            },
          formatRep: (rep) => {
              return rep > 0 ? "green-bold" : "red-bold";
          }
      }
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
    response.render("news", {
        layout: "main"
    });
});

app.get('/about', (request, response) => {
    response.render("about", {
        layout: "main"
    });
});

app.get('/map', (request, response) => {
    response.redirect("http://167.114.65.184:25621/?worldname=world&mapname=surface&zoom=5&x=-643&y=64&z=273");
});

app.get('/news', (request, response) => {
    database.get("news", {}, {}, -1, function(results) {
        response.render("news", {
            layout: "main",
            posts: results
        });
    });
});

app.get('/players', (request, response) => {
    database.get("players", {}, {name:1}, -1, function(results) {
        response.render("players", {
            layout: "main",
            all: results,
            online: results.filter((player) => { return player.online; }),
            banned: results.filter((player) => { return player.banned; }),
            members: results.filter((player) => { return player.member; })
        });
    });
});

app.get('/player/:playerName', (request, response) => {
    database.get("players", {name: request.params.playerName}, {}, -1, function(results) {
        if (results.length > 0)
            response.render("player", {
                layout: "main",
                player:results[0]
            });
        else response.render("404", {});
    });
});

app.get('/statistics', (request, response) => {
    response.render("stats", {
        layout: "main"
    });
});

app.get('/contact', (request, response) => {
    response.render("contact", {
        layout: "main"
    });
});

app.get('/philosophy', (request, response) => {
    response.render("philosophy", {
        layout: "main"
    });
});

//POST Parameter api for Spigot to connect to

app.use(express.json())

app.post("/api/*", (request, response, next) => {
    console.log(request.body.api_key+" == "+process.env.API_KEY);
    if (request.body.api_key == process.env.API_KEY)
        next();
    else response.sendStatus(403);
});

app.post("/api/post/update_player/:username", (request, response) => {
    console.log("body.rep = "+request.body.rep);
    console.log("params.rep = "+request.params.rep);
    console.log("query.rep = "+request.query.rep);
    database.update("players", {name: request.params.username}, {
        name: request.body.name,
        rep: request.body.rep,
        online: request.body.online,
        banned: request.body.banned,
        member: request.body.member,
        first_join: request.body.first_join,
        plots_owned: request.body.plots_owned,
        ban_count: request.body.ban_count,
        friend_count: request.body.friend_count,
        hours_remaining: request.body.hours_remaining
    }, function(results) {
        response.send(JSON.stringify(results));
    }, () => { response.sendStatus(404); });
});

//catchall and 404
app.get('*', (request, response) => {
    response.render("404", {
        layout: "no_header"
    });
});

/*LAUNCH THE HTTP SERVER ON PORT 80*/
const port = 80;
app.listen(port, function(err) {
    if (err) console.log("An error occurred.");
    console.log("Server started on port "+port);
    //console.log(JSON.stringify(process.env));
    database.connect();
});