import { getRecordsInLocation } from "./location";
import { std, variance } from "mathjs";
import moment from "moment";

export function getValuesInHour(records, hour) {
  let result = [];
  records.forEach((record) => {
    const time = moment(record.timestamp).format("YYYY-MM-DD HH:mm:ss");

    if (moment(time).hour() == hour) {
      result.push(record);
    }
  });
  return result;
}

export function getHourlyStandardDevAndVariance(records) {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const valuesInHour = getValuesInHour(records, i);
    let valuesOnly = [];
    valuesInHour.forEach((value) => {
      valuesOnly.push(value.value);
    });
    if (valuesOnly.length) {
      hours.push({
        std: std(valuesOnly).toFixed(2),
        variance: variance(valuesOnly).toFixed(2),
        hour: i,
      });
    }
  }
  return hours;
}

export function getHourlyAverages(records) {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const valuesInHour = getValuesInHour(records, i);
    hours.push(getAverage(valuesInHour).toFixed(2));
  }
  return hours;
}

export function getHourlyAggregatesByLocation(records, locationId) {
  const hours = [];
  const locationRecords = getRecordsInLocation(records, locationId);

  for (let i = 0; i < 24; i++) {
    const valuesInHour = getValuesInHour(locationRecords, i);
    let average = getAverage(valuesInHour).toFixed(2);
    let min = getMin(valuesInHour);
    let max = getMax(valuesInHour);
    if (min != 0 && max != 0 && average != 0) {
      hours.push({
        hour: i,
        avg: getAverage(valuesInHour).toFixed(2),
        min: getMin(valuesInHour),
        max: getMax(valuesInHour),
        count: valuesInHour.length,
      });
    } else {
      if (hours[i - 1]) {
        hours.push({
          hour: i,
          avg: hours[i - 1].avg,
          min: hours[i - 1].min,
          max: hours[i - 1].max,
          count: 1,
        });
      } else {
        hours.push({
          hour: i,
          avg: 0,
          min: 0,
          max: 0,
          count: 1,
        });
      }
    }
  }
  return hours;
}

export function getHourlyAggregates(records) {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const valuesInHour = getValuesInHour(records, i);
    let average = getAverage(valuesInHour).toFixed(2);
    let min = getMin(valuesInHour);
    let max = getMax(valuesInHour);

    if (min != 0 && max != 0 && average != 0) {
      hours.push({
        hour: i,
        avg: getAverage(valuesInHour).toFixed(2),
        min: getMin(valuesInHour),
        max: getMax(valuesInHour),
        count: valuesInHour.length,
      });
    } else {
      if (hours[i - 1]) {
        hours.push({
          hour: i,
          avg: hours[i - 1].avg,
          min: hours[i - 1].min,
          max: hours[i - 1].max,
          count: 1,
        });
      } else {
        hours.push({
          hour: i,
          avg: 0,
          min: 0,
          max: 0,
          count: 1,
        });
      }
    }
  }
  return hours;
}

export function getMax(records) {
  return Math.max.apply(
    Math,
    records.map((v) => {
      return v.value;
    })
  );
}

export function getMin(records) {
  return Math.min.apply(
    Math,
    records.map((v) => {
      return v.value;
    })
  );
}

export function getAverage(records) {
  let total = 0;
  if (!(Array.isArray(records) && records.length)) {
    return 0;
  }

  records.forEach((record) => {
    total += parseInt(record.value);
  });

  return total / records.length;
}
