import moment from "moment";

export function getValuesInHour(records, hour) {
    let result = [];
    records.forEach((record) => {
        const time = moment(record.timestamp).format('YYYY-MM-DD HH:mm:ss');

        if (moment(time).hour() == hour) {
            result.push(record);
        }
    });
    return result;
}
