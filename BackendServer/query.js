var AWS = require("aws-sdk");
var express = require("express");
var cors = require('cors');
const NodeCache = require("node-cache");
const cache = new NodeCache({
  stdTTL: 0,
  deleteOnExpire: false,
});

var app = express();

app.use(cors());

app.listen(3030, () => console.log("temps API listing on port 3030!"));
// Set the region
AWS.config.update({
  region: "ap-southeast-2",
  accessKeyId: "ENTER_YOUR_ACCESS_KEY_ID_HERE",
  secretAccessKey: "ENTER_YOUR_SECRET_ACCESS_KEY_HERE",
});

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;

app.get("/", function (req, res) {
  res.send({ title: "temp API Entry Point" });
});

// TEST: Find a record // can only get item using the partition key
// app.get('/temps', function (req, res) {
//   var params = {
//     TableName: 'humidity',
//     Key: {
//       'timestamp': {S:'2020-06-09 01:04:20'},
//     },
//   }

//   ddb.getItem(params, onGetItem);
//   // Call DynamoDB to read the item from the table
//   function onGetItem(err, data) {
//     if (err) {
//       console.log('Error 1', err);
//     } else {
//       res.send(data);
//       // res.send(JSON.stringify(data.Item));
//       // console.log('Success getting a specify item ', data.Item);
//     }
//   };
// });

app.get("/temps", async function (req, res) {
  var todayStart = today + " 00:00:00";
  var todayEnd = today + " 23:59:59";
  var firstRecord = "2020-06-09 01:10:00";
  var paramsTempScan = {
    ExpressionAttributeNames: {
      "#ts": "timestamp",
      "#lo": "location",
      "#val": "value",
    },
    ExpressionAttributeValues: {
      // ':a': { S: '2' },   // only get from that location
      ":start_time": { S: firstRecord },
      ":end_time": { S: todayEnd },
    },
    FilterExpression: "#ts between :start_time and :end_time",
    ProjectionExpression: "#ts, #lo, #val",
    TableName: "temperature",
  };
  try {
    const response = await ddb.scan(paramsTempScan, onScan).promise();
    console.log(response);
    if (response.Items) {
      let temps = response.Items.map((temp) => {
        return {
          value: temp.value.N,
          location: temp.location.S,
          timestamp: temp.timestamp.S,
        };
      });
      cache.set("temps", temps, 1000000000);
      res.send(temps);
    } else {
      const temps = cache.get("temps");
      if (temps == undefined) {
        res.send([]);
      } else {
        res.send(temps);
      }
    }
  } catch (err) {
    console.log("error", err);
    const temps = cache.get("temps");
    if (temps == undefined) {
      res.send([]);
    } else {
      res.send(temps);
    }
  }

  function onScan(err, data) {
    if (err) {
      console.log(
        "Unable to scan the table Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Scan succeeded.");

      // continue scanning if we have more records
      // because scan can only retrieve maximum of 1MB of data
      // we may not need this tho
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        ddb.scan(params, onScan);
      }
    }
  }
});

app.get("/hum", async function (req, res) {
  var todayStart = today + " 00:00:00";
  var todayEnd = today + " 23:59:59";
  var firstRecord = "2020-06-09 01:10:00";
  var paramsHumScan = {
    ExpressionAttributeNames: {
      "#ts": "timestamp",
      "#lo": "location",
      "#val": "value",
    },
    ExpressionAttributeValues: {
      // ':a': { S: '2' },   // only get from that location
      ":start_time": { S: firstRecord },
      ":end_time": { S: todayEnd },
    },
    // FilterExpression: '#lo = :a and #ts between :start_time and :end_time',  // this line work too
    FilterExpression: "#ts between :start_time and :end_time", // this line work
    ProjectionExpression: "#ts, #lo, #val",
    TableName: "humidity",
  };
  console.log(paramsHumScan);

  try {
    const response = await ddb.scan(paramsHumScan, onScan).promise();
    if (response.Items) {
      let hums = response.Items.map((temp) => {
        return {
          value: temp.value.N,
          location: temp.location.S,
          timestamp: temp.timestamp.S,
        };
      });
      cache.set("humidity", hums, 1000000000);
      res.send(hums);
    } else {
      const humidities = cache.get("humidity");
      if (humidities == undefined) {
        res.send([]);
      } else {
        res.send(humidities);
      }
    }
  } catch (err) {
    console.log("error", err);
    const humidities = cache.get("humidity");
    if (humidities == undefined) {
      res.send([]);
    } else {
      res.send(humidities);
    }
  }

  function onScan(err, data) {
    if (err) {
      console.log(
        "Unable to scan the table Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Scan succeeded.");

      // continue scanning if we have more records
      // because scan can only retrieve maximum of 1MB of data
      // we may not need this tho
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        ddb.scan(params, onScan);
      }
    }
  }
});