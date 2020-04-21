/* global google */

/**
 * Turn a latitude longitude coordinates into human readable form
 * 
 * @param {Float} lat   latitude position
 * @param {Float} lng   longitude position
 */
const getReverseGeocodingData = (lat, lng) => {
return new Promise((resolve, reject) => {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
            reject();
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            const address = (results[0].formatted_address);
            console.log(address);
            resolve(address);
        }
    });
});
}

/**
 * Convert a string address to lat long data
 * 
 * @param {string} addr string address to convert to lat lng data
 * 
 * @returns {object}    has lat, lng attributes both of which are functions (if resolved)
 */
function getGeocodingData(addr) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            'address': addr
        }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0){
                console.log('results[0] info')
                console.log(results[0].geometry.location)
                resolve(results[0].geometry.location);
            }
            else {
                reject(null);
            }
        })
    })
}

/**
 * 
 * @param {object} route route object returned from google maps. Should be a single route instead of an array of routes
 */
function totalRouteDistance (route) {
    let total = 0;
    for (let leg of route.legs){
        console.log('leg')
        console.log(leg)
        total += leg.distance.value;
    }
    return total;
}

/**
 * 
 * @param {Object} startLoc object with .lat and .lng callables for direction lookup
 * @param {Object} endLoc object with .lat and .lng callables for direction lookup
 * 
 * @returns {Promise} when resolved it does 
 */
async function getRoute(startLoc, endLoc){
    const directionsService = new google.maps.DirectionsService();
    const origin = startLoc;
    const destination = endLoc;

    return new Promise(async (resolve, reject) => {
        await directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    resolve(result);
                } 
                else {
                    console.log('Error: Directions could not be found');
                    reject();
                }
            }
            );
        }
    )
}

/**
 * 
 * @param {DOM Element} inputField  text input field DOM element to add places auto complete functionality to. Needs to be the input element
 * @param {object}      options     options argument to add. Documentation for this can be found at the google page https://developers.google.com/maps/documentation/javascript/places-autocomplete
 */
function makeInputAutoComplete (inputField, options) {
    options = options || {};
    return new google.maps.places.Autocomplete(inputField, options);
}

/**
 * Convert miles to meters
 * @param {Number, String} miles     Number or string of desired miles to meters
 */
function milesToMeters(miles){
    return parseFloat(miles) * 1609.34;
}

/**
 * Convert meters to miles
 * @param {Number, String} meters     Number or string of desired miles to meters
 */
function metersToMiles(meters){
    return parseFloat(meters)/1609.34;
}

/**
 * Find the direct distance between two points
 * @param {Geocoded location} point1 Geolocation point with .lat and .lng callables
 * @param {Geocoded location} point2 Geolocation point with .lat and .lng callables
 * 
 * @returns {Float} the distance between the two points in meters
 */
function getDistance (point1, point2) {
    let R = 6378137; // Earth’s mean radius in meter
    const rad = val => val*(Math.PI/180);
    let dLat = rad(point2.lat() - point1.lat());
    let dLong = rad(point2.lng() - point1.lng());
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(point1.lat())) * Math.cos(rad(point2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d; // returns the distance in meter
  };

export  {
    getReverseGeocodingData,
    getGeocodingData,
    totalRouteDistance,
    makeInputAutoComplete,
    milesToMeters,
    metersToMiles,
    getDistance,
    getRoute,
}