var express = require ("express");
var bodyParser = require ("body-parser");
var path = require ("path");
var app = express ();
var routes = require ("./routes/index.js");
const port = 4200;

app.set ("view engine", "ejs");
app.set ("views", path.join (__dirname, "views"));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));
app.engine ("html", require ("ejs").renderFile);
app.use (express.static (path.join (__dirname, "public")));
app.use ("/", routes);
server = app.listen (port, () => {
    console.log ("Server started at port " + port);
});
const io = require ("socket.io")(server);
io.on ("connection", (socket) => {
    socket.on ("username", (data) => {
        socket.username = data.username;
        console.log (socket.username + " joined!");
    });
    socket.on ("new_msg", (data) => {
        io.sockets.emit ("new_msg", {message: data.message, username: socket.username});
    });
});

exports = module.exports = app