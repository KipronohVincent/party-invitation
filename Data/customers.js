#!/usr/bin/node
// Reading a file  Asynchronously..c

const officeCoordinates = {
  latt: 53.339428,
  long: -6.257664
};

function formatContentToStringifiedObj(file) {
  const arr = file.split(/\r?\n/);
  return arr;
}

// get distance from longitude & latitude

function fetchDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  if (d > 1) return Math.round(d);
  else if (d <= 1) return Math.round(d * 1000) + 'm';
  return d;
}

// convert string array to object array
function convertStringArrToObjArr(contents) {
  const objArr = [];
  for (let i = 0; i < contents.length; i++) {
    const object = JSON.parse(contents[i]);
    objArr.push(object);
  }

  return objArr;
}

function fetchCustomersWithinRange(rawContent) {
  const stringifiedObjArr = formatContentToStringifiedObj(rawContent);
  const customers = convertStringArrToObjArr(stringifiedObjArr);

  const filteredCustomers = customers.filter(c => {
    const distance = fetchDistance(c.latitude, c.longitude, officeCoordinates.latt, officeCoordinates.long);
    if (distance <= 100) {
      return c;
    }
  });

  filteredCustomers.sort((a, b) => {
    // if first item is greater than second item, flip
    if (a.user_id < b.user_id) { return -1 }
  })
  return filteredCustomers.map(fc => { return { name: fc.name, user_id: fc.user_id } });
}

module.exports = { fetchCustomersWithinRange };