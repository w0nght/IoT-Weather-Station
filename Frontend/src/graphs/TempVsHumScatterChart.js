import React, {useEffect, useState} from "react";
import {CartesianGrid, ComposedChart, Legend, Line, LineChart, Scatter, Tooltip, XAxis, YAxis} from "recharts";
import getRegression from "./analytics/getRegression";

export default function TempVsHumScatterChart(props) {
    const [humReg, setHumReg] = useState([]);

    useEffect(() => {
        if (props.data.length) {
            const reg = getRegression(props.data, "temp", "hum", 0, 25);
            console.log(JSON.stringify(reg));
            setHumReg(reg);
        }
    }, [props.data]);

    return (
        <ComposedChart
            width={500}
            height={400}
            isAnimationActive={false}>
            <XAxis dataKey="temp" type="number" unit="C" domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]}
                   label={{value: 'Temperature (C)', position: 'insideBottom', offset: 0}}/>
            <YAxis dataKey="hum" type="number" domain={[0, 100]} unit="%"
                   label={{value: 'Humidity (%)', dx: 10, dy: 40, angle: -90, position: 'insideLeft'}}/>
            <Scatter name="humidity" data={props.data} fill="red"/>
            <Line name="humidity regression" dot={false} data={humReg} dataKey="hum" fill="red"/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip/>
        </ComposedChart>
    )
}
