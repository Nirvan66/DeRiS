/* global google */
import React, { Component } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,
  Marker
} from "react-google-maps";

import {
  getReverseGeocodingData,
  getGeocodingData
} from '../js_modules/googleMapUtils.js'

/**
 * Keep track of clicked locations and put a maker down 
 * 
 * @param {*} props 
 */
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

/**
 * 
 * @class Map   creates a map component. props should include .onClick that takes {location, isStartLoc, addresss}
 */
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null, 
      startCoords: null,
      endCoords: null,
      startAddr: null,
      endAddr: null, 
      centerCoords: null,
      locations: []
    };

    this.handleMapClick = this.handleMapClick.bind(this);
    this.getGeoLocation = this.getGeoLocation.bind(this);
    this.addRoute = this.addRoute.bind(this);
  }

async handleMapClick (ref, map, ev) {
  const location = ref.latLng;
  console.log('starting coordinates: ')
  console.log(this.state.startCoords)
  const isStartLoc = this.state.startCoords === null;

  // pass the location and address up to the caller
  const propsOnClick = (location, isStartLoc, addr) => {
      this.props.onClick({location: location, isStartLoc: isStartLoc, address: addr});
  } 
  // if this is the first click, we want the starting position
  if (isStartLoc) {
      this.setState(prevState => ({
          startCoords: location,
          locations: [...prevState.locations, location]
      }));
      const addr = await getReverseGeocodingData(location.lat(), location.lng());
      propsOnClick(location, isStartLoc, addr);
  }
  // if its the second one, we want the destination address
  else if (this.state.endCoords === null) {
      this.setState(prevState => ({
          endCoords: location,
          locations: [...prevState.locations, location]
      }));
      const addr = await getReverseGeocodingData(location.lat(), location.lng());
      
      propsOnClick(location, isStartLoc, addr);
      this.addRoute();
  }
}

// get users current geolocation data to center map around
 getGeoLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
              this.setState({
                  centerCoords: {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  }
              })
          }
      )
  } else {
      console.log('error')
  }
}

// add a route from the locations in the map
addRoute() {
  const directionsService = new google.maps.DirectionsService();
  const origin = this.state.startCoords;
  const destination = this.state.endCoords;

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result
        });
        this.props.onRouteMade({directions: result});
      } else {
        console.error(`error fetching directions ${result}`);
      }
    }
  );
}

// wait for component to load/mount before executing geolocation and letting parent know it mounted
  componentDidMount() {
    this.getGeoLocation();
  }

  // given an address, add a marker to the map at that location
  // address doesn't need to be valid, we will check for it here
  async addMarkerByAddress(address, isStart){
    if(!address || address === '' || address == undefined){
      return;
    }
    const latLng = await getGeocodingData(address);
    const coordsPos = isStart ? 'startCoords' : 'endCoords';
    this.setState(prevState => ({
      [coordsPos]: latLng,
      locations: [...prevState.locations, latLng]
  }));

  }

  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
        center={this.state.centerCoords}
        defaultZoom={14}
        onClick={this.handleMapClick}
      >
        <DirectionsRenderer
          directions={this.state.directions}
        />
        <MarkersList locations={this.state.locations}/>
      </GoogleMap>
    ));

    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `500px`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default Map;