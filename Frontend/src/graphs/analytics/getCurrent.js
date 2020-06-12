export function getCurrentInLocation(records, locationId) {
  records.reduce((r, item, i) => {
    if(locationId != item.location) return r
    if(!r.timestamp || r.timestamp < item.timestamp) {
      r = item
    }
    return r;
  }, {});
  // Object { value: "16", location: "3", timestamp: "2020-06-11 23:58:30" } // sent this out
}