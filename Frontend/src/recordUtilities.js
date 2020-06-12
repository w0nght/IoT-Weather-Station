const moment = require('moment');

export function convertRecordHum(humRecords) {
    let array = [];
    humRecords.forEach((record) => {
        array.push({
            location: record.location.S,
            timestamp: record.timestamp.S,
            hum: record.value.N,
        });
    })
    return array;
}

export function convertRecordTemp(tempRecords) {
    let array = [];
    tempRecords.forEach((record) => {
        array.push({
            location: record.location.S,
            timestamp: record.timestamp.S,
            temp: record.value.N,
        });
    })
    return array;
}

export function convertRecord(dynamoRecords) {
    let array = [];
    console.log(dynamoRecords);
    dynamoRecords.forEach((record) => {
        array.push({
            location: record.location,
            timestamp: record.timestamp,
            value: record.value,
        });
    })
    return array;
}

export function recordUtilities(a, b) {
    const timestampA = moment(a.timestamp).format('YYYY-MM-DD HH:mm:ss');
    const timestampB = moment(b.timestamp).format('YYYY-MM-DD HH:mm:ss');

    if (timestampA < timestampB) {
        return -1;
    }
    if (timestampB < timestampA) {
        return 1;
    }
    return 0;
}
