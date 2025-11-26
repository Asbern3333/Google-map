const fetch = require('node-fetch');
const { getBylatlongbyzip } = require('./Zip');
const GOOGLE_KEY = 'AIzaSyB-ZQMnAePDYIZLaSO9zJZWYCf4t1EVe1c';


/**-
 * AIzaSyB-ZQMnAePDYIZLaSO9zJZWYCf4t1EVe1c
 * Fetches detailed info for a place by its place_id.
 * Includes name, address, phone, and website.
 */
async function placeDetails(place_id) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,formatted_phone_number,website&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  return res.json();
}
async function placesSearchAll(query, zip) {
  const unique = new Map();
  let nextToken = null;
  let {latitude,longitude}=getBylatlongbyzip(zip);
  do {
    let q = `${query}`; // ZIP INSIDE QUERY
    let url =  `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
  `location=${latitude},${longitude}` +
  `&radius=1000` +
  `&keyword=${encodeURIComponent(query)}` +
  `&key=${GOOGLE_KEY}`;
    if (nextToken) url += `&pagetoken=${nextToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length) {
      for (const r of data.results) {
        if (!unique.has(r.place_id)) {
          unique.set(r.place_id, r);
        }
      }
    }

    nextToken = data.next_page_token;
    if (nextToken) {
      await new Promise(r => setTimeout(r, 2500));
    }

  } while (nextToken);

  return Array.from(unique.values());
}
async function placesSearchAllByZip(query, zip) {
  const results = new Map();
  let nextToken = null;
  const { latitude, longitude } = getBylatlongbyzip(zip);

  do {
    let url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${latitude},${longitude}` +
      `&radius=2500` +
      `&keyword=${encodeURIComponent(query)}` +
      `&key=${GOOGLE_KEY}`;

    if (nextToken) url += `&pagetoken=${nextToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (Array.isArray(data.results)) {
      for (const r of data.results) {
        // Fetch details to check the ZIP
        const details = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${r.place_id}&fields=address_components,name,formatted_address,formatted_phone_number,website&key=${GOOGLE_KEY}`
        ).then(x => x.json());

        const comps = details?.result?.address_components || [];

        const postal = comps.find(c => c.types.includes("postal_code"))?.long_name;

        if (postal === String(zip)) {
          results.set(r.place_id, details.result);
        }
      }
    }
    nextToken = data.next_page_token;
    if (nextToken) await new Promise(r => setTimeout(r, 2500));
  } while (nextToken);
  console.log(results.values());
  return Array.from(results.values());
}
/**
 * Recursively fetches all paginated Google Places results for a query.
 * Automatically waits 2.5s between page requests as required by Google.
 */
// async function placesSearchAll(query, zip) {
//   const unique = new Map();   // place_id → result
//   let nextToken = null;

//   do {
//     let url =
//       `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&address=${zip}&key=${GOOGLE_KEY}`;
    
//     if (nextToken) url += `&pagetoken=${nextToken}`;

//     const res = await fetch(url);
//     const data = await res.json();

//     if (data.results && data.results.length) {
//       for (const r of data.results) {
//         if (!unique.has(r.place_id)) {
//           unique.set(r.place_id, r);
//         }
//       }
//     }

//     nextToken = data.next_page_token;
//     if (nextToken) {
//       await new Promise(r => setTimeout(r, 2500)); // required
//     }
//   } while (nextToken);

//   return Array.from(unique.values());
// }

module.exports = { placeDetails, placesSearchAll,placesSearchAllByZip };
