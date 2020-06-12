import React, {useState, useEffect} from "react";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {getHourlyAggregatesByLocation} from "./analytics/getAggregates";

export default function SingleLocationHourlyLineChart(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (props.data.length) {
            const result = (getHourlyAggregatesByLocation(props.data, props.location));
            const hourly = [];
            result.forEach((value) => {
                if (value.min && value.max && value.avg) {
                    hourly.push(value);
                }
            })
            setData(hourly);
        }
    },[props.data]);

    if (props.type === "temp") {
        return (
            <LineChart
                width={500}
                height={400}
                data={data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis dataKey="temp" domain={[10, 25]} ticks={[10, 15, 20, 25]} unit="C"
                       label={{value: 'Mean temperature (C)', dx: 10, dy: 50, angle: -90, position: 'insideLeft'}}/>
                <Line name="max" dataKey="max" stroke="red" fill="white"/>
                <Line name="avg" dataKey="avg" stroke="green" fill="white"/>
                <Line name="min" dataKey="min" stroke="blue" fill="white"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "80px"}} />
                <Tooltip/>
            </LineChart>
        );
    } else {
        return (
            <LineChart
                width={500}
                height={400}
                data={data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis dataKey="hum" domain={[0, 100]} unit="%"
                       label={{value: 'Mean humidity (%)', dx: 10, dy: 50, angle: -90, position: 'insideLeft'}}/>
                <Line name="max" dataKey="max" stroke="red" fill="white"/>
                <Line name="avg" dataKey="avg" stroke="green" fill="white"/>
                <Line name="min" dataKey="min" stroke="blue" fill="white"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "80px"}} />
                <Tooltip/>
            </LineChart>
        )
    }
}
