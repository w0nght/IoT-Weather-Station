export function getRecordsInLocation(records, locationId){
    let result = [];
    records.forEach((record) => {
        if (record.location == locationId) {
            result.push(record);
        }
    })
    return result;
}
