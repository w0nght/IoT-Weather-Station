import React from "react";
import {Legend, Line, LineChart, XAxis, YAxis} from "recharts";
export default function HourlyAverageLineChart(props) {
    if (props.type === "temp") {
        return (
            <LineChart
                width={500}
                height={400}
                data={props.data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottomRight', offset: 0}}/>
                <YAxis dataKey="temp" domain={[10, 25]}
                       label={{value: 'Mean temperature', angle: -90, position: 'insideLeft'}}/>

                <Line name="max" dataKey="maxTemp" stroke="red" fill="white"/>
                <Line name="avg" dataKey="temp" stroke="green" fill="white"/>
                <Line name="min" dataKey="minTemp" stroke="blue" fill="white"/>
                <Legend/>
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
                       label={{value: 'Hour', position: 'insideBottomRight', offset: 0}}/>
                <YAxis dataKey="hum" domain={[0, 100]}
                       label={{value: 'Mean humidity', angle: -90, position: 'insideLeft'}}/>
                <Line name="max" dataKey="maxHum" stroke="red" fill="white"/>
                <Line name="avg" dataKey="hum" stroke="green" fill="white"/>
                <Line name="min" dataKey="minHum" stroke="blue" fill="white"/>
                <Legend/>
            </LineChart>
        )
    }
}
