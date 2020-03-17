/* global google */
import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

const MarkersList = props => {
  const { locations, ...markerProps } = props;
  return (
    <span>
      {locations.map((location, i) => {
        return (
          <Marker
            key={i}
            {...markerProps}
            position={{ lat: location.lat(), lng: location.lng() }}
          />
        );
      })}
    </span>
  );
};

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        startLocation: null,
        endLocation: null,
        locations: [],
        centerLocation: null
    };
    this.handleMapClick = this.handleMapClick.bind(this);
    this.getGeoLocation = this.getGeoLocation.bind(this);
    this.getReverseGeocodingData = this.getReverseGeocodingData.bind(this);
  }

  getReverseGeocodingData(lat, lng) {
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


  async handleMapClick (ref, map, ev) {
    const location = ev.latLng;
    const isStartLoc = this.state.startLocation === null;
    const panAndPassUp = (location, isStartLoc, addr) => {
        map.panTo(location);
        this.props.onClick({location: location, isStartLoc: isStartLoc, address: addr});
    } 

    if (isStartLoc) {
        this.setState(prevState => ({
            startLocation: location,
            locations: [...prevState.locations, location]
        }));
        const addr = await this.getReverseGeocodingData(location.lat(), location.lng());
        panAndPassUp(location, isStartLoc, addr);
    }
    else if (this.state.endLocation === null) {
        this.setState(prevState => ({
            endLocation: location,
            locations: [...prevState.locations, location]
        }));
        const addr = await this.getReverseGeocodingData(location.lat(), location.lng());
        panAndPassUp(location, isStartLoc, addr);
    }
    
  };

  getGeoLocation = () => {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          console.log('stetting state to (lat, long): ' + coords.latitude + ' ' + coords.longitude);
          this.setState({
            centerLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });
        });
    }
  }

  componentDidMount() {
      this.getGeoLocation();
  }

  render() {
        const startingCenter = (this.state.centerLocation === null || this.state.centerLocation === {}) ? this.props.center : this.state.centerLocation;
        return (
        <div className="map-container">
            <Map
            google={this.props.google}
            className={"map"}
            zoom={this.props.zoom}
            defaultCenter={startingCenter}
            center={startingCenter}
            onClick={this.handleMapClick}
            >
            <MarkersList locations={this.state.locations}/>
            </Map>
        </div>
        );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyChykMQlbWKcQy-qixkVnXCrGVoy-vdlM4",
  libraries: []
})(MapContainer);
