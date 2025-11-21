const fetch = require('node-fetch');

const GOOGLE_KEY = 'AIzaSyBiljf2n63Y7I-GSmxCeT5VlOf2mHsVrdQ';


/**
 * AIzaSyB-ZQMnAePDYIZLaSO9zJZWYCf4t1EVe1c
 * Fetches detailed info for a place by its place_id.
 * Includes name, address, phone, and website.
 */
async function placeDetails(place_id) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,formatted_phone_number,website&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  return res.json();
}

/**
 * Recursively fetches all paginated Google Places results for a query.
 * Automatically waits 2.5s between page requests as required by Google.
 */
async function placesSearchAll(query, zip) {
  let allResults = [];
  let nextToken = null;

  do {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}address=${zip}&key=${GOOGLE_KEY}`;
    if (nextToken) url += `&pagetoken=${nextToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length) {
      allResults = allResults.concat(data.results);
    }
    console.log(`Result ${allResults} results for query "${query}" in ZIP ${zip}.`);
    nextToken = data.next_page_token;
    if (nextToken) await new Promise(r => setTimeout(r, 2500));
  } while (nextToken);

  return allResults;
}

module.exports = { placeDetails, placesSearchAll };
