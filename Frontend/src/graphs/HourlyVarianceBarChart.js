import React, {useEffect, useState} from "react";
import {Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {getHourlyStandardDevAndVariance} from "./analytics/getAggregates";

export default function HourlyAverageLineChart(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (props.data.length) {
            const result = getHourlyStandardDevAndVariance(props.data);
            setData(result);
        }
    }, [props.data]);

    let yDomain = [0, 125];
    let yTicks = [0, 25, 50, 75, 100, 125];

    if (props.metric=="variance") {
        return (
            <BarChart
                width={500}
                height={400}
                data={data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis dataKey="variance" domain={yDomain} ticks={yTicks}
                       label={{value: 'Variance', angle: -90, dx: 15, dy: 30, position: 'insideLeft'}}/>
                <Bar name="variance" dataKey="variance" fill="green"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Tooltip/>
            </BarChart>
        );
    } else {
        return (
            <BarChart
                width={500}
                height={400}
                data={data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottom', offset: 0}}/>
                <YAxis dataKey="std" domain={yDomain} ticks={yTicks}
                       label={{value: 'Standard Deviation', dx: 15, dy: 50, angle: -90, position: 'insideLeft'}}/>
                <Bar name="std" dataKey="std" fill="blue"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Tooltip/>
            </BarChart>
        );
    }
}
