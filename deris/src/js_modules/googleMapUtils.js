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

export  {
    getReverseGeocodingData
}