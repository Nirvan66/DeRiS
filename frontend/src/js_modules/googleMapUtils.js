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
 * @param {DOM Element} inputField  text input field DOM element to add places auto complete functionality to. Needs to be the input element
 * @param {object}      options     options argument to add. Documentation for this can be found at the google page https://developers.google.com/maps/documentation/javascript/places-autocomplete
 */
function makeInputAutoComplete (inputField, options) {
    options = options || {};
    return new google.maps.places.Autocomplete(inputField, options);
}

export  {
    getReverseGeocodingData,
    getGeocodingData,
    totalRouteDistance,
    makeInputAutoComplete
}