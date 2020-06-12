const server = require("http").createServer();
const io = require("socket.io")(server);
var AWS = require("aws-sdk");

let fanTemp = 10;
let lastFanTemp = {
  "1": 10,
  "2": 10,
  "3": 10,
};

// Set the region
AWS.config.update({
  region: "ap-southeast-2",
  accessKeyId: "ENTER_YOUR_ACCESS_KEY_ID_HERE",
  secretAccessKey: "ENTER_YOUR_SECRET_ACCESS_KEY_HERE",
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

io.listen(8000);

io.on("connection", function (socket) {
  console.log("Client connected");
  socket.emit("website", "connected to socket");
  socket.on("changeTemp", (data) => {
    fanTemp = data;
    socket.emit("fanTemp", fanTemp);
    console.log("channel", fanTemp, lastFanTemp[1]);
    if (fanTemp < lastFanTemp[1]) {
      socket.broadcast.emit("fanOn", 1);
    } else {
      socket.broadcast.emit("fanOff", 1);
    }
    if (fanTemp < lastFanTemp[2]) {
      socket.broadcast.emit("fanOn", 2);
    } else {
      socket.broadcast.emit("fanOff", 2);
    }
    if (fanTemp < lastFanTemp[3]) {
      socket.broadcast.emit("fanOn", 3);
    } else {
      socket.broadcast.emit("fanOff", 3);
    }
  });

  socket.on("data", function (data) {
    console.log(data);
    socket.emit("website", "sending data");
    if (fanTemp < data.temp) {
      socket.broadcast.emit("fanOn", data.location);
    } else {
      socket.broadcast.emit("fanOff", data.location);
    }

    lastFanTemp[data.location.toString()] = data.temp;
    console.log(lastFanTemp);

    socket.emit("website", data);
    var params = {
      TableName: "humidity",
      Item: {
        value: { N: data.humidity },
        location: { S: data.location.toString() },
        timestamp: { S: data.time },
      },
    };

    ddb.putItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success Humidity", data);
      }
    });

    var tempParams = {
      TableName: "temperature",
      Item: {
        value: { N: data.temp },
        location: { S: data.location.toString() },
        timestamp: { S: data.time },
      },
    };

    ddb.putItem(tempParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success Temperature", data);
      }
    });
  });
});