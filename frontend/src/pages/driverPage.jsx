import React from 'react';
import './styles/driverPage.css'
import { ButtonWithLabelsList } from '../modules/lists.jsx'
import { SingleTextBox } from '../modules/textInputs.jsx'
import { SingleButton } from '../modules/buttonInputs.jsx'
import { withScriptjs } from "react-google-maps";
import Map from '../modules/googleMap.jsx';
import { milesToMeters } from '../js_modules/googleMapUtils.js'

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
            isCancel: false
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
        console.log(event)
        let radius = event.target.value;
        // verify that its an ok number
        if (isNaN(parseFloat(radius)) || parseFloat(radius) < 0){
            this.localVals.hasRadius = 0;
            this.setState({radius: 0, stringRadius: '0'})
            return;
        }
        this.setState({radius: parseFloat(radius), stringRadius: radius});
        this.localVals.hasRadius = true;
        console.log('Radius is set to ')
        console.log(radius)
    }

    // return the job details from the list item clicked
    onJobAccept(event) {
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
        const currentRides = this.props.currentRides;
        console.log('Current rides are')
        console.log(currentRides)
        return {
            elements:[
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '123 applewood road', '456 nutmeg avenue', '13'
                    ],
                    onClick: this.onJobAccept
                },
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '802 fisherman road', '111 colorado avenue', '10'
                    ],
                    onClick: this.onJobAccept
                },
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '910 lakeview blvd', '100 cold street', '29'
                    ],
                    onClick: this.onJobAccept
                }, 
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '992 montgomery street', '529 eisenhower blvd', '2'
                    ],
                    onClick: this.onJobAccept
                }
            ]

        }
    }

    onMapClick(payload){
        this.localVals.hasCenter = true;
        this.setState({
            center: payload.location,
            centerAddress: payload.address
        });
    }

    onCircleRadiusChange(payload){
        console.log(payload)
    }

    render() {
        if (!this.props.show){
            return (<div class="empty"></div>)
        }
        const elements = this.getRides();
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

        const centerMapOn = this.state.center ? this.state.center: null;

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
                <ButtonWithLabelsList
                    elements={elements.elements}
                ></ButtonWithLabelsList>
                <SingleButton
                    onClick={this.onCancelSubmit}
                    label='Cancel'
                ></SingleButton>
            </div>
        )
    }
}

export default DriverPage;