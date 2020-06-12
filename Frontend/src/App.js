import React, { useEffect, useState } from "react";
import {
  AppBar,
  Container,
  Paper,
  Grid,
  Typography,
  Slider,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import HourlyAverageLineChart from "./graphs/HourlyLineChart";
import TempVsHumScatterChart from "./graphs/TempVsHumScatterChart";
import { getHourlyAggregates } from "./graphs/analytics/getAggregates";
import AllLocationsScatterChart from "./graphs/AllLocationsScatterChart";
import AllLocationsLineChart from "./graphs/AllLocationsLineChart";
import SingleLocationHourlyLineChart from "./graphs/SingleLocationHourlyLineChart";
import HourlyVarianceBarChart from "./graphs/HourlyVarianceBarChart";
import DisplayCurrentBox from "./displayCurrent";

const io = require("socket.io-client");
const socket = io.connect("http://localhost:8000", { reconnect: true });

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);

  const [temps, setTemps] = useState([]);
  const [hums, setHums] = useState([]);
  // [{temp: 17.5, hum: 66.3, hour: 0}, {temp: 14.4, hum: 65.0, hour: 1} ...]
  const [hourlyAggregates, setHourlyAggregates] = useState([]);

  const [fanTemp, setFanTemp] = useState(10);

  useEffect(() => {
    socket.on("connect", function () {
      console.log("Connected");

      socket.on("website", function (data) {
        console.log("web", data);
      });

      socket.on("fanTemp", (data) => {
        console.log("received", data);
        setFanTemp(data);
      });
    });

    fetch("http://localhost:3030/temps", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setTemps(data));

    fetch("http://localhost:3030/hum", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setHums(data));
  }, []);

  useEffect(() => {
    if (temps.length != 0 && hums.length != 0) {
      const tempAggregates = getHourlyAggregates(temps);
      const humAggregates = getHourlyAggregates(hums);
      console.log(tempAggregates);
      console.log(humAggregates);
      let result = new Array();
      for (let i = 0; i < 24; i++) {
        let data = {};
        if (tempAggregates[i] && humAggregates[i]) {
          data.temp = tempAggregates[i].avg;
          data.hum = humAggregates[i].avg;
          data.minTemp = tempAggregates[i].min;
          data.maxTemp = tempAggregates[i].max;
          data.tempCount = tempAggregates[i].count;
          data.minHum = humAggregates[i].min;
          data.maxHum = humAggregates[i].max;
          data.humCount = humAggregates[i].count;
          data.hour = i;
          result.push(data);
        } else {
          if (result[i - 1]) {
            result.push({
              temp: result[i - 1].temp,
              hum: result[i - 1].hum,
              minTemp: result[i - 1].minTemp,
              maxTemp: result[i - 1].maxTemp,
              tempCount: 1,
              minHum: result[i - 1].minHum,
              maxHum: result[i - 1].maxHum,
              humCount: 1,
              hour: i,
            });
          }
        }
      }
      setHourlyAggregates(result);
      setLoading(false);
    }
  }, [temps, hums]);

  const handleTempChange = (e, value) => {
    if (socket.connected) {
      socket.emit("changeTemp", value);
    }
  };

  return (
    <div className="App">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar position="relative" style={{ padding: "20px" }}>
        <Container>
          <Typography variant="h4">
            {"Temperature & Humidity Tracker"}
          </Typography>
        </Container>
      </AppBar>
      <Container style={{ marginTop: "20px" }}>
        <Grid container justify="space-between" spacing={2}>
          <Grid item xs={12} style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">Temp ({"\u00b0C"})</Typography>
              <br />
              <Slider
                value={fanTemp}
                color="secondary"
                min={0}
                max={50}
                onChange={handleTempChange}
                step={1}
                valueLabelDisplay="auto"
                marks={true}
                style={{ width: "300px" }}
              />
            </Paper>
          </Grid>
          <Grid item xs={6} style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Current Temp ({"\u00b0C"})
              </Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="overline">Location 1</Typography>
                  <DisplayCurrentBox data={temps} type="temp" location={1} />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Location 2</Typography>
                  <DisplayCurrentBox data={temps} type="temp" location={2} />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Location 3</Typography>
                  <DisplayCurrentBox data={temps} type="temp" location={3} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6} style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Current Hum ({"%"})
              </Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="overline">Location 1</Typography>
                  <DisplayCurrentBox data={hums} type="hum" location={1} />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Location 2</Typography>
                  <DisplayCurrentBox data={hums} type="hum" location={2} />
                </Grid>
                <Grid item>
                  <Typography variant="overline">Location 3</Typography>
                  <DisplayCurrentBox data={hums} type="hum" location={3} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Mean Hourly Temperature at Each Location
              </Typography>
              <AllLocationsLineChart type="temp" data={temps} />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Mean Hourly Humidity at Each Location
              </Typography>
              <AllLocationsLineChart type="hum" data={hums} />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Mean Hourly Temperatures At All Locations
              </Typography>
              <HourlyAverageLineChart data={hourlyAggregates} type="temp" />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Mean Hourly Humidity At All Locations
              </Typography>
              <HourlyAverageLineChart data={hourlyAggregates} type="hum" />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Variance (All Temp Measurements)
              </Typography>
              <HourlyVarianceBarChart
                data={temps}
                metric="variance"
                type="temp"
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Variance (All Humidity Measurements)
              </Typography>
              <HourlyVarianceBarChart
                data={hums}
                metric="variance"
                type="hum"
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Standard Deviation (All Temp Measurements)
              </Typography>
              <HourlyVarianceBarChart data={temps} metric="std" type="temp" />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Standard Deviation (All Humidity Measurements)
              </Typography>
              <HourlyVarianceBarChart data={hums} metric="std" type="hum" />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Location 1 vs Location 2 vs Location 3 (Mean Temp)
              </Typography>
              <AllLocationsScatterChart type="temp" data={temps} />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Location 1 vs Location 2 vs Location 3 (Mean Humidity)
              </Typography>
              <AllLocationsScatterChart type="hum" data={hums} />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Temp at Location 1
              </Typography>
              <SingleLocationHourlyLineChart
                data={temps}
                type="temp"
                location={1}
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Humidity at Location 1
              </Typography>
              <SingleLocationHourlyLineChart
                data={temps}
                type="humidity"
                location={1}
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Temp at Location 2
              </Typography>
              <SingleLocationHourlyLineChart
                data={temps}
                type="temp"
                location={2}
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Humidity at Location 2
              </Typography>
              <SingleLocationHourlyLineChart
                data={hums}
                type="hum"
                location={2}
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Temp at Location 3
              </Typography>
              <SingleLocationHourlyLineChart
                data={temps}
                type="temp"
                location={3}
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Humidity at Location 3
              </Typography>
              <SingleLocationHourlyLineChart
                data={hums}
                type="hum"
                location={3}
              />
            </Paper>
          </Grid>
          <Grid style={{ padding: "20px" }}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="overline">
                Hourly Mean Temp vs Hourly Mean Humidity (All Locations)
              </Typography>
              <TempVsHumScatterChart data={hourlyAggregates} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;