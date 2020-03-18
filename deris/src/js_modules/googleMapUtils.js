/* global google */

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

export  {
    getReverseGeocodingData,
    totalRouteDistance
}