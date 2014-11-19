var serialport = require('serialport');
var prompt = require('prompt');

var express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http);
var webPort = process.env.PORT || 8080;

var portsNames = [];
var port;

function listPorts(){
    serialport.list(function (err, ports) {
        console.log('Available serial ports :')
        var count = 0;
        ports.forEach(function(port) {
            console.log(" [" + count + "] " + port.comName);
            portsNames.push(port.comName);
            // questions2[0].default = port.comName;
            count++;
        });
        // console.log(portsNames);
        // console.log('');
        prompt.get({
            name: 'port',
            description: 'Port number',
            default: 2,
            type: 'number'
        }, function (err, result) {
            if (err) { return onErr(err); }
            port = portsNames[result.port];
            start();
        });
    });
};

listPorts();

var serial;

function start(){
    serial = new serialport.SerialPort(port, {parser: serialport.parsers.readline( '\r' )  } );
    serial.on("open", function () {
        serial.write("angle 0\r", function(err, results) {
            // console.log('err ' + err);
            // console.log('results ' + results);
        });
    });

    app.use(express.static(__dirname + "/public/"));

    http.listen(webPort, function(){
        console.log('listening on port ' + webPort);
    });

    io.on('connection', function(socket)
    {
        console.log('Client connected.');

        socket.on('angle', function(e){
            setAngle(e);
        });

        socket.on('disconnect', function() {
            console.log('Client disconnected.');
        });
    });

    function setAngle(e){
        var angle = map_number(e, 0, 100, 1000, 2000);
        console.log('angle ' + angle);
        serial.write("angle " + angle + "\r", function(err, results){

        });
    }

}

map_number = function (number, in_min , in_max , out_min , out_max ) {
  return ( number - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}