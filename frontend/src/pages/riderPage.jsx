import React from 'react';
import './styles/riderPage.css'
import { TwoButtonTwoTextSubmission } from '../modules/textInputs.jsx'
import { withScriptjs } from "react-google-maps";
import  Map  from '../modules/googleMap.jsx'
import { totalRouteDistance, metersToMiles } from '../js_modules/googleMapUtils.js'
/**
 * The module for the rider page
 * 
 * @param {object}  props       Properties passed in from the App. Should have 
 *                              onSubmit: function that takes payload 
 *                                  {
 *                                      startLocation:  string, 
 *                                      endLocation:    string,
 *                                      requestType:    string
 *                                  }
 *                                  request type is either 'request' or 'cancel'
 *                              show: boolean to render the page
 * 
 * @returns {React.Component}   The react component for the entire page
 */

const API_KEY = 'AIzaSyChykMQlbWKcQy-qixkVnXCrGVoy-vdlM4'
const MapLoader = withScriptjs(Map);
const weiPerMile = 100;

class RiderPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            startLocation: '',
            endLocation: '',
            startAddress: '',
            endAddress: '',
            tripRate: '',
            directions: null,
            needsReset: false,
        }

        this.onChange = this.onChange.bind(this);
        this.onRequestSubmit = this.onRequestSubmit.bind(this);
        this.onCancelSubmit = this.onCancelSubmit.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onRouteMade = this.onRouteMade.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    resetState(){
        this.setState({
            startLocation: '',
            endLocation: '',
            startAddress: '',
            endAddress: '',
            tripRate: '',
            directions: null,
            needsReset: false,
        });
    }

    // keep tracking the user input to use for submission. need to discern by name
    onChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }
    // submit functions for the request and cancel buttons
    onRequestSubmit(event) {
        event.preventDefault();
        if (!this.props.DEV && !this.state.startLocation && !this.state.endLocation){
            alert('Please pick a pickup and drop off location.')
        }
        let startLoc, endLoc, startAddr, endAddr, tripRate, directions;
        if (this.props.DEV){
            startLoc = {lat: 40.212334, lng: 100.34};
            endLoc = {lat: 40.3421, lng: 100.3350};
            startAddr ='1234 Hollywood Drive';
            endAddr = '456 Elm Street';
            directions = ['nice'];
            tripRate = 420;
        }
        else {
            startLoc = this.state.startLocation;
            endLoc = this.state.endLocation;
            startAddr = this.state.startAddress;
            endAddr = this.state.endAddress;
            tripRate = Math.round(this.state.tripRate);
            directions = this.state.directions;
        }
        this.props.onSubmit({
            startLocation:  startLoc,
            endLocation:    endLoc,
            startAddress:   startAddr,
            endAddress:     endAddr,
            requestType:    'request',
            directions,
            tripRate
        });
    }
    onCancelSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({
            startLocation:  this.state.startLocation,
            endLocation:    this.state.endLocation,
            requestType:    'cancel'
        });
    }

    onMapClick(payload) {
        if (!this.state.startLocation) {
            this.setState({
                startLocation: payload.location,
                startAddress: payload.address, 
                needsReset: true,
            })
        }
        else {
            this.setState({
                endLocation: payload.location,
                endAddress: payload.address,
                needsReset: true,
            })
        }
    }

    onRouteMade(payload) {
        console.log('PAYLOAD FROM ON ROUTE MADE')
        console.log(payload)
        const directions = payload;
        const totalDistance = metersToMiles(totalRouteDistance(directions.routes[0]));
        const tripRate = totalDistance * weiPerMile;
        this.setState({directions, tripRate, needsReset: true})
    }

    render() {
        if (!this.props.show){
            if (this.state.needsReset){
                this.resetState();
            }
            return (<div className="empty"></div>)
        }
        const inputFieldOne = {label: 'Pick-up Location', value: this.state.startAddress};
        const inputFieldTwo = {label: 'Drop-off Location', value: this.state.endAddress};
        const primaryButton = {submitFunction: this.onRequestSubmit, label: 'Request'};
        const secondaryButton = {submitFunction: this.onCancelSubmit, label: 'Cancel'};
        const directions = this.state.startLocation && this.state.endLocation ? {startLoc: this.state.startLocation, endLoc: this.state.endLocation} : null;

        return (
            <div className="RiderPage">
                <table classname="RideInfoContainer">
                    <tbody>
                        <tr>
                            <td>
                                <div className="rateContainer">Rate: {Math.round(this.state.tripRate)}</div>
                            </td>
                            <td>
                                <TwoButtonTwoTextSubmission
                                    inputFieldOne={inputFieldOne}
                                    inputFieldTwo={inputFieldTwo}
                                    primaryButton={primaryButton}
                                    secondaryButton={secondaryButton}
                                    onChange={this.onChange}
                                ></TwoButtonTwoTextSubmission>
                            </td>
                        </tr>
                    </tbody>
                </table>
            
            <MapLoader
                googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + API_KEY }
                loadingElement={<div style={{ height: `100%`, width: '100%' }} />}
                onClick={this.onMapClick}
                onRouteMade={this.onRouteMade}
                directions={directions}
                addRoute={true}
            />
            </div>
        )
    }
}

export default RiderPage;