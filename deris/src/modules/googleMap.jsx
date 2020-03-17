/* global google */
import React, { Component } from "react";
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
        locations: []
    };
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  handleMapClick = (ref, map, ev) => {
    const location = ev.latLng;
    const isStartLoc = this.state.startLocation === null;
    const panAndPassUp = (location, isStartLoc) => {
        map.panTo(location);
        this.props.onClick({location: location, isStartLoc: isStartLoc});
    } 

    if (isStartLoc) {
        this.setState(prevState => ({
            startLocation: location,
            locations: [...prevState.locations, location]
        }));
        panAndPassUp(location, isStartLoc);
    }
    else if (this.state.endLocation === null) {
        this.setState(prevState => ({
            endLocation: location,
            locations: [...prevState.locations, location]
        }));
        panAndPassUp(location, isStartLoc);
    }
    
  };

  render() {
    return (
      <div className="map-container">
        <Map
          google={this.props.google}
          className={"map"}
          zoom={this.props.zoom}
          initialCenter={this.props.center}
          onClick={this.handleMapClick}
        >
         <MarkersList locations={this.state.locations}/>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCK7TbLy1gjaYdVWLb8Tj_YR9_1OQ5v2Sc",
  libraries: []
})(MapContainer);
