import React, {useEffect, useState} from "react";
import {CartesianGrid, ComposedChart, Line, LineChart, Scatter, Tooltip, XAxis, YAxis} from "recharts";
import {getHourlyAggregatesByLocation} from "./analytics/getAggregates";
import getRegression from "./analytics/getRegression";
import Legend from "recharts/lib/component/Legend";

export default function AllLocationsScatterChart(props) {
    const [combined, setCombined] = useState([]);
    const [l2Reg, setL2Reg] = useState([]);
    const [l3Reg, setL3Reg] = useState([]);

    useEffect(() => {
        if (props.data.length > 0) {
            const l1 = getHourlyAggregatesByLocation(props.data, 1);
            const l2 = getHourlyAggregatesByLocation(props.data, 2);
            const l3 = getHourlyAggregatesByLocation(props.data, 3);

            let allValues = [];
            for (let i = 0; i < 23; i++) {
                if (l1[i].avg && l2[i].avg && l3[i].avg) {
                    allValues.push({
                        l1: l1[i].avg,
                        l2: l2[i].avg,
                        l3: l3[i].avg,
                        hour: i,
                    });
                }
            }
            setCombined(allValues);


            if (props.type==="temp"){
                setL2Reg(getRegression(allValues, "l1", "l2", 0, 25));
                setL3Reg(getRegression(allValues, "l1", "l3", 0, 25));
            } else if (props.type==="hum"){
                setL2Reg(getRegression(allValues, "l1", "l2", 0, 100));
                setL3Reg(getRegression(allValues, "l1", "l3", 0, 100));
            }


        }
    }, [props.data]);

    if (props.type === "temp") {
        return (
            <ComposedChart
                isAnimationActive={false}
                width={500}
                height={400}>
                <XAxis dataKey="l1" type="number" domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} unit="C"
                       label={{value: 'Location 1 Temp (C)', position: 'insideBottom', offset: 0}}/>
                <YAxis yAxisId="l2" dataKey="l2" hide={true} type="number" domain={[10, 20]}
                />
                <YAxis yAxisId="l3" dataKey="l3" type="number" domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} unit="C"
                       label={{value: 'Other Location Temp (C)', dy: 80, dx: 10, angle: -90, position: 'insideLeft'}}/>
                <Scatter name="location 2" yAxisId="l2" dataKey="l2" data={combined} fill="red"/>
                <Scatter name="location 3" yAxisId="l3" dataKey="l3" data={combined} fill="green"/>

                <Line name="location 2 regression" legendType="none" dot={false} yAxisId="l2" dataKey="l2" data={l2Reg} stroke="red"/>
                <Line name="location 3 regression" legendType="none" dot={false} yAxisId="l3" dataKey="l3" data={l3Reg} stroke="green"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "80px"}}/>
                <Tooltip/>

            </ComposedChart>
        )
    } else {
        return (
            <ComposedChart
                isAnimationActive={false}
                width={500}
                height={400}>
                <XAxis dataKey="l1" type="number" domain={[0, 100]} unit="%"
                       label={{value: 'Location 1 Humidity (%)', position: 'insideBottom', offset: 0}}/>
                <YAxis yAxisId="l2" dataKey="l2" hide={true} type="number" domain={[0, 100]}
                />
                <YAxis yAxisId="l3" dataKey="l3" type="number" domain={[0, 100]} unit="%"
                       label={{value: 'Other Location Humidity (%)', dy: 80, angle: -90, position: 'insideLeft'}}/>
                <Scatter name="location 2" yAxisId="l2" dataKey="l2" data={combined} fill="red"/>
                <Scatter name="location3" yAxisId="l3" dataKey="l3" data={combined} fill="green"/>

                <Line name="location 2 regression" legendType="none" dot={false} yAxisId="l2" dataKey="l2" data={l2Reg} stroke="red"/>
                <Line name="location 3 regression" legendType="none" dot={false} yAxisId="l3" dataKey="l3" data={l3Reg} stroke="green"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Legend verticalAlign="top" align="center" wrapperStyle={{paddingLeft: "80px"}}/>
                <Tooltip/>
            </ComposedChart>
        )
    }
}
