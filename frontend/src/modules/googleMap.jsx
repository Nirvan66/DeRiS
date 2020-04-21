/* global google */
import React, { Component } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,
  Marker, 
  Circle
} from "react-google-maps";

import {
  getReverseGeocodingData,
  getGeocodingData,
  getRoute,
} from '../js_modules/googleMapUtils.js'

/**
 * Keep track of clicked locations and put a maker down 
 * 
 * @param {*} props 
 */
const MarkersList = props => {
  let { locations, ...markerProps } = props;
  if (locations.length > props.maxLocations){
    locations = locations.slice(0, props.maxLocations);
  }
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
      startCoords: null,
      endCoords: null,
      startAddr: null,
      endAddr: null, 
      centerCoords: null,
      locations: [],
      directions: null,
      directionsRendered: false
    };

    this.handleMapClick = this.handleMapClick.bind(this);
    this.getGeoLocation = this.getGeoLocation.bind(this);
    this.getCircleVals = this.getCircleVals.bind(this);

    this._map = null;
    this.circle = null;
  }

  // asynchronosly handle a map click
async handleMapClick (ref, map, ev) {
  const location = ref.latLng;

  // pass the location and address up to the caller
  const propsOnClick = (location, addr) => {
    if (this.props.onClick) {
      this.props.onClick({location: location, address: addr});
    }
  } 
  // if props has a set max number of locations, return
  if (this.props.maxLocations && this.props.maxLocations <= this.state.locations.length){
    return;
  }
  // update to add a new location
  this.setState( prevState => ({
    locations: [...prevState.locations, location]
  }));
  const addr = await getReverseGeocodingData(location.lat(), location.lng());
  propsOnClick(location, addr);
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

async addRoute(startLoc, endLoc) {
  const directions = await getRoute(startLoc, endLoc);

  if (this.props.onRouteMade){
    this.props.onRouteMade(directions);
  }
  this.setState({
    directionsRendered: true,
    directions
  });
}

// get the properties of the circle
getCircleVals() {
  const newRadius = this.circle.getRadius();
  if (this.props.onRadiusChanged) {
    this.props.onRadiusChanged({radius: newRadius})
  }
}

// wait for component to load/mount before executing geolocation and letting parent know it mounted
  componentDidMount() {
    this.getGeoLocation();
  }

  // given an address, add a marker to the map at that location
  // address doesn't need to be valid, we will check for it here
  async addMarkerByAddress(address){
    if(!address || address === '' || address == undefined){
      return;
    }
    const latLng = await getGeocodingData(address);
    this.setState(prevState => ({
      locations: [...prevState.locations, latLng]
  }));
  }

  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        ref={(map) => this._map = map}
        defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
        center={this.props.center ? this.props.center : this.state.centerCoords}
        defaultZoom={14}
        onClick={this.handleMapClick}
      >
        {this.state.directions && this.state.directionsRendered && (
          <DirectionsRenderer
          directions={this.state.directions}
        />
        )}
        <MarkersList locations={this.state.locations} maxLocations={this.props.maxLocations || 10}/>
        {this.props.circle && this.props.circle.show && (
          <Circle
            ref={circ => this.circle = circ}
            defaultCenter={
              this.props.circle.center
            }
            radius={this.props.circle.radius}
            options={this.props.circle.options}
            editable={this.props.circle.editable || false}
            draggable={this.props.circle.draggable || false}
            onRadiusChanged={this.getCircleVals}
            onCenterChanged={this.getCircleVals}
          >  
          </Circle>
        )}
      </GoogleMap>
    ));
    if (this.props.directions && !this.state.directionsRendered && this.props.addRoute){
      this.addRoute(this.props.directions.startLoc, this.props.directions.endLoc);
    }
    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `500px`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%` }} />}
          directions={this.state.directions}
        />
      </div>
    );
  }
}

export default Map;