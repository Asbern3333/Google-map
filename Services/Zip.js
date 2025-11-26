const fs = require('fs');
const path = require('path');

// Load the JSON file
const zipFilePath = path.join(__dirname, '../Data/USCities.json'); // adjust path if needed
let jsonData = [];

try {
  const fileContent = fs.readFileSync(zipFilePath, 'utf8');
  jsonData = JSON.parse(fileContent);
} catch (err) {
  console.error('Failed to load ZIP data:', err);
}

/**
 * Get all ZIP codes for a given city
 */
function getZipsByCity(state, city) {
  /*  Testing The result:
  console.log(jsonData.filter(r => r.state === state &&  r.city.toLowerCase() === city[0].toLowerCase()).map(r => r.zip_code));*/

  return jsonData.filter(r => r.state === state && r.city.toLowerCase() === city[0].toLowerCase()).map(r => r.zip_code);
}
/**
 * Get all ZIP codes for a given state
 */
function getZipsByState(state) {
  if (!state) return [];
  /*console.log(jsonData.filter(
    item => item.state && item.state.trim().toLowerCase() === state.trim().toLowerCase()
  ).map(r => r.zip_code));*/
  return jsonData.filter(item => item.state && item.state.trim().toLowerCase() === state.trim().toLowerCase()).map(r => r.zip_code);
}
function getBylatlongbyzip(zip) {
  if (!zip) return null;

  const match = jsonData.find(item => item.zip_code == zip);
  if (!match) return null;

  return {
    latitude: match.latitude,
    longitude: match.longitude
  };
}

module.exports = { getZipsByCity, getZipsByState,getBylatlongbyzip };
