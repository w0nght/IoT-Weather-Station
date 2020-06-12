import React, {useEffect, useState} from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {getHourlyAggregatesByLocation, getHourlyAverages} from "./analytics/getAggregates";
import Legend from "recharts/lib/component/Legend";

export default function AllLocationsScatterChart(props) {
    const [combined, setCombined] = useState([]);
    useEffect(() => {
        if (props.data.length > 0) {
            const l1 = getHourlyAggregatesByLocation(props.data, 1);
            const l2 = getHourlyAggregatesByLocation(props.data, 2);
            const l3 = getHourlyAggregatesByLocation(props.data, 3);
            let allValues = [];
            for (let i = 0; i < 24; i++) {
                let total = 0;
                let count = 0;
                const value = {
                    hour: i,
                };

                if (l1[i].avg) {
                    value.l1 = l1[i].avg;
                    total += parseFloat(l1[i].avg);
                    count ++;
                }
                if (l2[i].avg) {
                    value.l2 = l2[i].avg;
                    total += parseFloat(l2[i].avg);
                    count ++;
                }
                if (l3[i].avg){
                    value.l3 = l3[i].avg;
                    total += parseFloat(l3[i].avg);
                    count ++;
                }

                if (count) {
                    value.avg = total / count;
                }
                allValues.push(value);
            }
            setCombined(allValues);
        }
    }, [props.data]);

    if (props.type === "temp") {
        return (
            <LineChart
                isAnimationActive={false}
                data={combined}
                width={500}
                height={400}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis type="number" domain={[10, 25]} ticks={[10, 15, 20, 25]} unit="C"
                       label={{value: 'Mean Temp (C)', dx: 10, dy: 50, angle: -90, position: 'insideLeft'}}/>
                <Line dataKey="l1" name="location 1" stroke="red"/>
                <Line dataKey="l2" name="location 2" stroke="blue"/>
                <Line dataKey="l3" name="location3" stroke="green"/>
                <Line dataKey="avg" name="avg" stroke="grey"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "60px"}} />
                <Tooltip/>
            </LineChart>
        )
    } else {
        return (
            <LineChart
                isAnimationActive={false}
                width={500}
                data={combined}
                height={400}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis type="number" domain={[0, 100]} unit="%"
                       label={{value: 'Mean Humidity (%)', dx: 10, dy: 50, angle: -90, position: 'insideLeft'}}/>
                <Line dataKey="l1" name="location 1" stroke="red"/>
                <Line dataKey="l2" name="location 2" stroke="blue"/>
                <Line dataKey="l3" name="location3" stroke="green"/>
                <Line dataKey="avg" name="avg" stroke="grey"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "60px"}} />
                <Tooltip/>
            </LineChart>
        )
    }
}
