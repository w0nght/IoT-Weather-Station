const io = require('socket.io-client');
const socket = io.connect('http://149.28.177.118:8000', { reconnect: true });
const moment = require('moment');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var send = true;
var fanStatus = false;

setInterval(() => {
	send = true;
}, 600000)

const port = new SerialPort('/dev/ttyACM0', {baudRate: 9600});
const parser = new Readline();
port.pipe(parser);

socket.on('connect', function() {
	console.log('Connected');

	socket.on('fanOn', (data) => {
		if (data == 2 && !fanStatus) {
			console.log("fanOn");
			port.write("fanon", (err) => console.log(err));
      fanStatus = true;
		}
	});

	socket.on('fanOff', (data) => {
		if (data == 2 && !fanStatus) {
			console.log("fanOff");
			port.write("fanoff", (err) => console.log(err));
      fanStatus = false;
		}
	});

	socket.on('disconnect', function() {
		console.log("Client disconnected.");
	});

});

parser.on('data', function (data) {
	//console.log(data);
	const array = data.split(" ");
	const temp = array[0].replace("Temp:", "");
	const hum = array[1].replace("Humidity:", "");
	const location = 2;
	const record = {
		temp: temp,
		humidity: hum,
		location: location,
		time: moment().format("YYYY-MM-DD HH:mm:ss"),
	}
 	console.log(record);
	if (send) {
		socket.emit('data', record);
		send = false;
	}
});





