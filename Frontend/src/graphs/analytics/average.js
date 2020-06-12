import {getValuesInHour} from "./timePeriods"
import {getRecordsInLocation} from "./location";

export function getLocationAverageHourly(records, locationId){
    const hours = [];
    const locationRecords = getRecordsInLocation(records,locationId);
    console.log(JSON.stringify(locationRecords));
    for (let i = 0; i < 24; i++){
        const valuesInHour = getValuesInHour(locationRecords, i);
        hours.push({
            hour: i,
            value: getAverage(valuesInHour).toFixed(2)
        })
    }
    return hours;
}

export function getAverageHourly(records){
    const hours = [];
    for (let i = 0; i < 24; i++){
        const valuesInHour = getValuesInHour(records, i);
        hours.push({
            hour: i,
            value: getAverage(valuesInHour).toFixed(2)
    });
    }
    return hours;
}

export function getAverage(records) {
    let total = 0;
    if (!(Array.isArray(records) && records.length)) {
        return 0;
    }

    records.forEach((record) => {
        total += parseInt(record.value);
    })

    return total / records.length;

}
