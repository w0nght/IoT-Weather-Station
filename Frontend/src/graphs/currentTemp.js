import React, {useEffect, useState} from "react";
import {Line, LineChart, XAxis, YAxis, BarChart, Bar} from "recharts";
import {getHourlyAggregatesByLocation, getAverage, getHourlyAverages} from "./analytics/getAggregates";
import {getRecordsInLocation} from "./analytics/location";
import {getHourlyStandardDevAndVariance} from "./analytics/getAggregates";
import Legend from "recharts/lib/component/Legend";

export default function AllLocationsCurrentChart(props) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (props.data.length) {
            const result = getHourlyStandardDevAndVariance(props.data);
            setData(result);
            console.log(JSON.stringify(result));
        }
    }, [props.data]);

    if (props.type=="temp") {
        return (
            <BarChart
                width={500}
                height={400}
                data={data}
                isAnimationActive={false}>
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 5, 11, 17, 23]}
                       label={{value: 'Hour', position: 'insideBottomRight', offset: 0}}/>
                <YAxis dataKey="variance" domain={[0, 15]}
                       label={{value: 'Variance', angle: -90, position: 'insideLeft'}}/>
                <Bar name="variance" dataKey="variance" fill="green"/>
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
                       label={{value: 'Hour', position: 'insideBottomRight', offset: 0}}/>
                <YAxis dataKey="std" domain={[0, 15]}
                       label={{value: 'Standard Dev', angle: -90, position: 'insideLeft'}}/>
                <Bar name="std" dataKey="std" fill="blue"/>
            </BarChart>
        );
    }
}