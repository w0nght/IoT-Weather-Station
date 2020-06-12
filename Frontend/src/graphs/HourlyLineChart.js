import React from "react";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
export default function HourlyAverageLineChart(props) {
    if (props.type === "temp") {
        return (
            <LineChart
                width={500}
                height={400}
                data={props.data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis dataKey="temp" domain={[10, 25]} ticks={[10, 15, 20, 25]} unit="C"
                       label={{value: 'Mean temperature (C)', dx: 10, dy: 50, angle: -90, position: 'insideLeft'}}/>

                <Line name="max" dataKey="maxTemp" stroke="red" fill="white"/>
                <Line name="avg" dataKey="temp" stroke="green" fill="white"/>
                <Line name="min" dataKey="minTemp" stroke="blue" fill="white"/>
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "80px"}} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Tooltip/>
            </LineChart>
        );
    } else if (props.type === "hum") {
        return (
            <LineChart
                width={500}
                height={400}
                data={props.data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis dataKey="hum" domain={[0, 100]} unit="%"
                       label={{value: 'Mean humidity (%)', dx: 10, dy: 40, angle: -90, position: 'insideLeft'}}/>
                <Line name="max" dataKey="maxHum" stroke="red" fill="white"/>
                <Line name="avg" dataKey="hum" stroke="green" fill="white"/>
                <Line name="min" dataKey="minHum" stroke="blue" fill="white"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "80px"}} />
                <Tooltip/>
            </LineChart>
        )
    }
}
