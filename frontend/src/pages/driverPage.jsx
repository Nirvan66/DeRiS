import React from 'react';
import './styles/driverPage.css'
import { ButtonWithLabelsList } from '../modules/lists.jsx'
import { SingleTextBox } from '../modules/textInputs.jsx'
import { SingleButton } from '../modules/buttonInputs.jsx'
import { withScriptjs } from "react-google-maps";
import Map from '../modules/googleMap.jsx';
import { milesToMeters, metersToMiles, getDistance, getReverseGeocodingData, getRoute, getGeocodingData } from '../js_modules/googleMapUtils.js'

const API_KEY = 'AIzaSyChykMQlbWKcQy-qixkVnXCrGVoy-vdlM4'
const MapLoader = withScriptjs(Map);

/**
 * The module for the driver page
 * 
 * @param {object}  props      
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
            currentRides: [],
            needsReset: false,
        }

        this.localVals = {
            hasCenter: false,
            hasRadius: false,
            requestedRides: false
        }

        this.getRides = this.getRides.bind(this);
        this.onCenterLocChange =  this.onCenterLocChange.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
        this.onJobAccept = this.onJobAccept.bind(this);
        this.onCancelSubmit = this.onCancelSubmit.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        this.onCircleRadiusChange = this.onCircleRadiusChange.bind(this);
        this.createCircleObject = this.createCircleObject.bind(this);
        this.filterJobs = this.filterJobs.bind(this);
        this.renderJobButtons = this.renderJobButtons.bind(this);
        this.renderListHeader = this.renderListHeader.bind(this);
        this.refreshJobList = this.refreshJobList.bind(this);
        this.ridesContains = this.ridesContains.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    resetState(){
        this.localVals = {
            hasCenter: false,
            hasRadius: false,
            requestedRides: false
        }
        this.setState({
            center: null,
            centerAddress: null,
            radius: null,
            stringRadius: null,
            jobInfo: null,
            isCancel: false,
            currentRides: [],
            needsReset: false,
        })
    }

    componentDidMount(){
        if (this.props.DEV){
            // if in dev return a fake item
            this.setState({
                currentRides: [{
                    startAddr: '1234 Hollywood Drive',
                    endAddr: '456 Elm Street',
                    startLoc: {lat: () => 40.1112, lng: () => 100.222},
                    endLoc: {lat: () => 40.1122, lng: () => 100.232},
                    distance: 789
                }]
            });
            return;
        }
    }

    // update the centering location 
    onCenterLocChange(event) {
        event.preventDefault();
        this.setState({center: event.target.value});
    }

    // update the radius
    onRadiusChange(event) {
        event.preventDefault();
        
        let radius = event.target.value;
        // verify that its an ok number
        if (isNaN(parseFloat(radius)) || parseFloat(radius) < 0){
            this.localVals.hasRadius = 0;
            this.setState({radius: 0, stringRadius: ''})
            return;
        }
        this.localVals.hasRadius = true;
        this.setState({radius: parseFloat(radius), stringRadius: radius});
    }

    // get the arrival time. Value returned is in seconds
    async getArrivalTime(rideInfo){
        const { startAddr, endAddr } = rideInfo;
        const startLoc = await getGeocodingData(startAddr);
        const endLoc = await getGeocodingData(endAddr);
        const directions = await getRoute(startLoc, endLoc);
        return [ 
            directions.routes[0].legs[0].duration.value,
            startLoc,
            endLoc
        ]
    }

    // return the job details from the list item clicked
    async onJobAccept(event) {
        const sep = '/?/';
        const state = this.state;
        event.preventDefault();

        let jobInfo = event.target.value.split(sep);
        let rideInfo = null;
        // get the real job info 
        for (let ride of this.state.currentRides){
            if (ride.startAddr == jobInfo[0] || ride.startAddr == jobInfo[1] &&
                ride.endAddr == jobInfo[0] || ride.endAddr == jobInfo[1]){
                    rideInfo = ride;
                }
        }
        if (!rideInfo){
            alert('Could not find ride with the information:' + jobInfo);
            return;
        }
        state.isCancel = false;
        state.jobInfo = rideInfo;

        // get the route from start to end to get the time needed
        const arrivalDetails = await this.getArrivalTime(rideInfo);
        state.arrivalTime = arrivalDetails[0];
        state.jobInfo.startLoc = arrivalDetails[1];
        state.jobInfo.endLoc = arrivalDetails[2];
     
        // pass the data back up to the caller
        if (this.props.onSubmit){
            this.props.onSubmit(state);
        }
    }

    // handle the cancel button 
    onCancelSubmit(event) {
        event.preventDefault();
        const state = this.state;
        state.isCancel = true;
        this.props.onSubmit(state);
    }

    ridesContains(currentRides, newRide){
        for (let ride of currentRides){
            if (ride.riderNumber == newRide.riderNumber){
                return true;
            }
        }
        return false;
    }

    // Getting rides from blockchain.
    async getRides(payload) {

        // it comes in as NOT being valid locations
        // lat and lng are <value>*1000000 so divide by that
        // comes in an array of [lat, lng]
        // payload.returnvalues.(pick, drop).(lat, long)
        if (this.state.needsReset){
            this.resetState();
        }

        const multFactor = 1000000;

        const ride = payload.returnValues;
        let currentRides = this.state.currentRides;
        const makeForDistanceCalc = loc => {return {lat: () => loc.lat / multFactor, lng: () => loc.long / multFactor}};

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
            startAddr: startAddr, 
            endAddr: endAddr,
            rate: parseInt(ride.escrow)
        };
        if (this.ridesContains(currentRides, validRide)){
            return;
        }
        currentRides.push(validRide);
        this.setState({currentRides, needsReset: true});
    }

    // set the center when the map is clicked
    onMapClick(payload){
        this.localVals.hasCenter = true;
        this.setState({
            center: payload.location,
            centerAddress: payload.address,
            needsReset: true
        });
    }

    // when cicle radius is changed from the map, run this function
    onCircleRadiusChange(payload){
        let { radius } = payload;
        radius = metersToMiles(radius);
        radius = Math.round(radius * 100) / 100;
        this.setState({radius: parseFloat(radius), stringRadius: radius.toString(), needsReset: true});
    }

    // create object for the map to create a circle from 
    createCircleObject(){
        return {
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
    }

    // refresh and look for more jobs
    refreshJobList(){
        const startTime = new Date().getTime();
        this.props.getAvailableRides(this.props.ethereumAddress);
        console.log('get available rides time') 
        console.log(new Date().getTime() - startTime)
    }

    // only take the jobs that are within my radius
    filterJobs(){
        if (!this.props.DEV && (!this.state.center || !this.state.radius)){
            return this.state.currentRides;
        }

        if (this.props.DEV){
            // if in dev return a fake item
            return [{
                    startAddr: '1234 Hollywood Drive',
                    endAddr: '456 Elm Street',
                    startLoc: {lat: () => 40.1112, lng: () => 100.222},
                    endLoc: {lat: () => 40.1122, lng: () => 100.232},
                    distance: 789,
                    rate: 69,
                }];
        }

        let closeRides = [];
        const distBetween = (start, end) => metersToMiles(getDistance(start, end));
        for (let ride of this.state.currentRides){
            // filter jobs by starting location. If they're within the radius, pass on to caller
            if (distBetween(this.state.center, ride.startLoc) <= this.state.radius){
                ride.distance = distBetween(this.state.center, ride.startLoc);
                closeRides.push(ride);
            }
        }
        return closeRides;
    }

    renderListHeader(){
        return (
            <table className="ListHeadings">
                <tbody>
                    <tr>
                        <td>Pick Up Location</td>
                        <td>Drop Off Location</td>
                        <td>Job Fare</td>
                        <td>Accept Job</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    // create buttons for rides
    renderJobButtons(){
        if (!this.props.DEV && (!this.state.currentRides || !this.state.currentRides.length)){
            return(<div></div>)
        }
        
        let closeRides = this.filterJobs();

        let currentRidesButtons = [];
        
        for (let ride of closeRides){
            const butt = {
                buttonLabel: 'Accept',
                labels: [ride.startAddr, ride.endAddr, ride.rate],
                onClick: this.onJobAccept,
            }
            currentRidesButtons.push(butt);
        }
        
        return (
            <div className="DriverPageJobListContainer">
                {this.renderListHeader()}
                <ButtonWithLabelsList
                    elements={currentRidesButtons}
                ></ButtonWithLabelsList>
            </div>
            
        )
    }

    render() {
        // return if not supposed to show
        if (!this.props.show){
            console.log('IN THE NO SHOW IN RIDER PROG. NEEDS RESET IS')
            console.log(this.state.needsReset)
            if (this.state.needsReset){
                this.resetState();
            }
            return (<div className="empty"></div>)
        }
        // circle info if ready for it
        const circle = this.createCircleObject();
        
        // where to center the map
        const centerMapOn = this.state.center ? this.state.center: null;

        // look for new rides
        if (!this.localVals.requestedRides && this.props.getAvailableRidesListener){
            this.props.getAvailableRidesListener(this.getRides);
        }
        if (!this.localVals.requestedRides && this.props.getAvailableRides && this.props.ethereumAddress){
            this.localVals.requestedRides = true;
            this.refreshJobList();
        }

        return (
            <div className="driverPageContainer">
                <table className="textBoxTableContainer">
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
                {this.renderJobButtons()}
                <div className='refreshButtonContainer'>
                    <SingleButton
                        onClick={this.refreshJobList}
                        label='Refresh Jobs'
                    ></SingleButton>
                </div>
                <div className='cancelButtonContainer'>
                    <SingleButton
                        onClick={this.onCancelSubmit}
                        label='Cancel'
                    ></SingleButton>
                </div>
            </div>
        )
    }
}

export default DriverPage;