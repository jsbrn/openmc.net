function init(websockets) {

    websockets.on('connection', function(socket) {
        console.log(socket.id+" has connected!");
        socket.emit("connection", ""); //tell client of a successful connection (send the socket ID too)

        //if a request comes in, send to all other clients in hopes one of them is the MC server
        socket.on('request player list', function() {
            socket.broadcast.emit("request player list", "")
        });

        socket.on('request stats', function() {
            socket.broadcast.emit("request stats", "")
        });

        //when player list is sent from MC server, send to all other clients
        socket.on('player list', function(playerString) {
            console.log("Received player list: "+playerString);
            socket.broadcast.emit("player list", playerString)
        });

        //when stats string is sent from MC server, send to all other clients
        socket.on('stats', function(playerString) {
            console.log("Received player list: "+playerString);
            socket.broadcast.emit("stats", playerString)
        });
        
    });

}

module.exports.init = init;