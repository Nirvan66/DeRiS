import React from 'react';
import './styles/driverPage.css'
import { ButtonWithLabelsList } from '../modules/lists.jsx'
import { SingleTextBox } from '../modules/textInputs.jsx'
import { SingleButton } from '../modules/buttonInputs.jsx'
import { withScriptjs } from "react-google-maps";
import Map from '../modules/googleMap.jsx';
import { milesToMeters, metersToMiles, getDistance, getReverseGeocodingData } from '../js_modules/googleMapUtils.js'

const API_KEY = 'AIzaSyChykMQlbWKcQy-qixkVnXCrGVoy-vdlM4'
const MapLoader = withScriptjs(Map);

/**
 * The module for the driver page
 * 
 * @param {object}  props       Properties passed in from the App. Should have 
 *                              onSubmit: function that takes payload 
 *                                  {
 *                                      center:         number, 
 *                                      radius:         number,
 *                                      jobInfo:        object,
 *                                      isCancel:       boolean
 *                                  }
 *                                  request type is either 'request' or 'cancel'
 *                              show: boolean to render the page
 * 
 * @returns {React.Component}   The react component for the entire page
 */
class DriverPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            center: null,
            centerAddress: null,
            radius: null,
            stringRadius: null,
            jobInfo: null,
            isCancel: false,
            currentRides: null
        }

        this.localVals = {
            hasCenter: false,
            hasRadius: false,
        }

        this.getRides = this.getRides.bind(this);
        this.onCenterLocChange =  this.onCenterLocChange.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
        this.onJobAccept = this.onJobAccept.bind(this);
        this.onCancelSubmit = this.onCancelSubmit.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onCircleRadiusChange = this.onCircleRadiusChange.bind(this);
    }
    // update the centering location 
    onCenterLocChange(event) {
        event.preventDefault();
        this.setState({center: event.target.value});
    }

    // update the radius
    onRadiusChange(event) {
        event.preventDefault();
        console.log('RAN ON RADIUS CHANGE')
        let radius = event.target.value;
        // verify that its an ok number
        if (isNaN(parseFloat(radius)) || parseFloat(radius) < 0){
            this.localVals.hasRadius = 0;
            this.setState({radius: 0, stringRadius: ''})
            return;
        }
        this.setState({radius: parseFloat(radius), stringRadius: radius});
        this.localVals.hasRadius = true;
        this.getRides();
    }

    // return the job details from the list item clicked
    onJobAccept(event) {
        console.log(event);
        return;
        const sep = '/?/';
        const state = this.state;
        event.preventDefault();

        const jobInfo = event.target.value.split(sep);
        state.isCancel = false;
        state.jobInfo = jobInfo;

        // pass the data back up to the caller
        this.props.onSubmit(state);
    }

    // handle the cancel button 
    onCancelSubmit(event) {
        event.preventDefault();
        const state = this.state;
        state.isCancel = true;
        this.props.onSubmit(state);
    }

    // Getting rides from blockchain. Mock for now
    getRides() {
        let currentRides;
        if (!this.state.radius || this.state.radius == 0){
            return;
        }
        this.props.currentRides.then(async (val) => {
            // format of the value when returned is 
            //{0: "0", 1: "40.0157559841748,-105.27940536896972", 2: "40.01437553630915,-105.22885109345702", riderNumber: "0", pick: "40.0157559841748,-105.27940536896972", drop: "40.01437553630915,-105.22885109345702"}
            currentRides = val;
            let validRides = [];
            const makeForDistanceCalc = loc => {return {lat: () => parseFloat(loc.split(',')[0]), lng: () => parseFloat(loc.split(',')[1])}}
            for (let ride of currentRides){
                let distance = getDistance(this.state.center, makeForDistanceCalc(ride.pick));
                distance = metersToMiles(distance);
                if (distance <= this.state.radius){
                    let callableStartLoc = makeForDistanceCalc(ride.pick);
                    let callableEndLoc = makeForDistanceCalc(ride.drop);
                    let nonCallableStartLoc = {lat: callableStartLoc.lat(), lng: callableStartLoc.lng()}
                    let nonCallableEndLoc = {lat: callableEndLoc.lat(), lng: callableEndLoc.lng()}
                    
                    const startAddr = await getReverseGeocodingData(nonCallableStartLoc);
                    const endAddr = await getReverseGeocodingData(nonCallableEndLoc);
                    let validRide = {
                        riderNumber: ride.riderNumber,
                        startLoc: makeForDistanceCalc(ride.pick),
                        endLoc: makeForDistanceCalc(ride.drop),
                        distance: distance,
                        startAddr: startAddr, 
                        endAddr: endAddr
                    };
                    validRides.push(validRide);
                }
            }
            this.setState({currentRides: validRides});
        });
    }

    onMapClick(payload){
        this.localVals.hasCenter = true;
        this.setState({
            center: payload.location,
            centerAddress: payload.address
        });
    }

    onCircleRadiusChange(payload){
        let { radius } = payload;
        radius = metersToMiles(radius);
        radius = Math.round(radius * 100) / 100;
        this.setState({radius: parseFloat(radius), stringRadius: radius.toString()});
        this.getRides();
    }

    render() {
        // return if not supposed to show
        if (!this.props.show){
            return (<div class="empty"></div>)
        }
        // circle info if ready for it
        const circle = {
            center: this.state.center,
            radius: milesToMeters(this.state.radius),
            show: this.localVals.hasCenter && this.localVals.hasRadius,
            editable: true,
            dragable: false,
            options: {
                strokeColor: "#ff0000"
            },
            onRadiusChanged: this.onCircleRadiusChange
        }
        // where to center the map
        const centerMapOn = this.state.center ? this.state.center: null;
        // need to "buttonify" the current rides
        let currentRidesButtons = null;        
        if (this.state.currentRides && this.state.currentRides.length){
            currentRidesButtons = [];
            for (let ride of this.state.currentRides){
                const butt = {
                    buttonLabel: 'Accept',
                    labels: [ride.startAddr, ride.endAddr, ride.distance],
                    onClick: this.onJobAccept,
                }
                currentRidesButtons.push(butt);
            }
        }
        console.log('currentRidesButtons')
        console.log(currentRidesButtons)
        return (
            <div class="driverPageContainer">
                <table class="textBoxTableContainer">
                    <tbody>
                    <tr>
                        <td>
                        <SingleTextBox
                            label='Location'
                            onChange={this.onCenterLocChange}
                            value={this.state.centerAddress}
                        ></SingleTextBox>
                        </td>
                        <td>
                        <SingleTextBox
                            label='Radius (miles)'
                            onChange={this.onRadiusChange}
                            value={this.state.stringRadius}
                        ></SingleTextBox>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <MapLoader
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + API_KEY }
                    loadingElement={<div style={{ height: `100%`, width: '100%' }} />}
                    onClick={this.onMapClick}
                    circle={circle}
                    maxLocations={1}
                    onRadiusChanged={this.onCircleRadiusChange}
                    center={centerMapOn}
                />
                {currentRidesButtons && currentRidesButtons.length && 
                <ButtonWithLabelsList
                    elements={currentRidesButtons}
                ></ButtonWithLabelsList>
                }
                
                <SingleButton
                    onClick={this.onCancelSubmit}
                    label='Cancel'
                ></SingleButton>
            </div>
        )
    }
}

export default DriverPage;