import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import'./styles/rideProgressPage.css'
import spinner from '../resources/spinner.gif'
import rideAcceptedSpinner from '../resources/oke.gif'
import hopIn from '../resources/hopin.gif'
import { SingleButton } from '../modules/buttonInputs'
import {metersToMiles} from '../js_modules/googleMapUtils'

const mockTimePerMile = 100; // every mile takes x amount of seconds

/**
 * 
 * @param {object} props 
 */
class RideProgressPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSpinner: true,
            rideAccepted: false,
            driverArrived: false,
            riderInformed: false,
            paid: null,
        }
        this.localVals = {
            startedListener: false
        }
        this.onRideAccepted = this.onRideAccepted.bind(this);
        this.renderSpinner = this.renderSpinner.bind(this);
        this.onDriverArrived = this.onDriverArrived.bind(this);
        this.renderDriverButton = this.renderDriverButton.bind(this);
        this.informRider = this.informRider.bind(this);
        this.mockTrip = this.mockTrip.bind(this);
        this.payDriver = this.payDriver.bind(this);
        this.onDriverPaid = this.onDriverPaid.bind(this);
        this.renderDriverPayout = this.renderDriverPayout.bind(this);
    }

    onRideAccepted(payload){
        this.setState({showSpinner: false, rideAccepted: true})
    }

    onDriverArrived(payload){
        if (!this.localVals.startedListener){
            return;
        }
        this.setState({driverArrived: true});
    }

    payDriver(amount){
        if (!this.props.payDriver){
            console.log('CANNOT PAY DRIVER NO FUNCTION TO DO SO')
        }
        this.props.payDriver(amount, this.props.ethereumAddress);
    }

    mockTrip(){
        console.log('mocking trip')
        let totalTripDistance = 0; // meters

        console.log('DIRECTIONS')
        console.log(this.props.directions)
        const route = this.props.directions.routes[0].legs[0];

        for (let leg of route.steps){
            totalTripDistance += leg.distance.value;
        }
        
        const totalPayout = this.props.tripRate;
        let runningPayout = 0;
        console.log('TOTAL DISTANCE')
        console.log(totalTripDistance)
        console.log('TOTAL PAYOUT')
        console.log(totalPayout)
        const payoutLeg = (leg) => {
            let percentTraveled =  (leg.distance.value / totalTripDistance);
            let thisPayout = Math.floor(totalPayout * percentTraveled);
            console.log('THIS PAYOUT')
            console.log(thisPayout)
            if (thisPayout + runningPayout > totalPayout){
                // pay the remaining
                this.payDriver(totalPayout - runningPayout);
            }
            else {
                // pay this payout
                this.payDriver(thisPayout)
            }
            runningPayout += thisPayout;
        }

        // execute payoutLeg after sleep time
        for (let leg of route.steps){
            const sleepTime = metersToMiles(leg.distance.value) * mockTimePerMile * 1000;// ms to seconds
            console.log('SLEEP TIME IS ')
            console.log(sleepTime)
            setTimeout(payoutLeg(leg), sleepTime);
        }

        // check to see if there is any remaining money to pay out
        if (totalPayout - runningPayout > 0){
            // pay the difference
            this.payDriver(totalPayout - runningPayout)
        }
    }

    onDriverPaid(payload){
        if (this.props.role == 'rider'){
            return;
        }
        const {driverNumber, bills} = payload.returnValues;
        console.log('Driver paid function')
        console.log(driverNumber + '\n' + bills);
        // TODO: check driver number
        const nextPayment = parseInt(bills);
        this.setState(prevState => ({paid: prevState.paid += nextPayment}));
    }

    // render the spinner while waiting
    renderSpinner(){
        if (this.props.role == 'rider'){
            if (this.state.showSpinner) {
                return (
                    <div className="rideSubittedWaiting">
                        <div><b>Ride Submitted! Waiting for a driver to accept your trip...</b></div>
                        <img className="spinner" src={spinner} alt="Loading..."></img>
                    </div>
                )
            }
            else if (this.state.rideAccepted && !this.state.driverArrived){
                return (
                    <div className="rideAcceptedWaiting">
                        <div><b>Ride accepted! Waiting on driver to arrive...</b></div>
                        <img className="spinner" src={rideAcceptedSpinner} alt="Loading..."></img>
                    </div>
                    
                )
            }
            else if (this.state.driverArrived){
                return (
                    <div className="driverArrived">
                        <div><b>Driver arrived! Hop in!</b></div>
                        <img className="spinner" src={hopIn} alt="Loading..."></img>
                        <SingleButton
                            label={'Start Trip'}
                            onClick={this.mockTrip}
                        ></SingleButton>
                    </div>
                )
            }
        }
        return (<div></div>)
    }

    informRider(){
        // dummy location to pass just for now
        const dummyLoc = {lat: 40.223, lng: 100.2223};
        this.props.informRider(dummyLoc, this.props.ethereumAddress);
        this.setState({riderInformed: true})
    }

    renderDriverButton(){
        if (this.props.role == 'driver'){
            if (this.state.riderInformed){
                return (<div></div>)
            }
            return (
                <SingleButton className="informRiderButton"
                    label='Inform Rider'
                    onClick={this.informRider}
                ></SingleButton>
            )
        }
    }

    renderDriverPayout(){
        if (this.props.role == 'driver'){
            if (this.state.riderInformed){
                return (
                <div className="driverPayout">{this.state.paid} of {this.props.tripRate}</div>
                )
            }
        }
    }

    render() {
        if (!this.props.show){
            return (<div className="empty"></div>)
        }

        if(this.props.role == 'rider' && this.props.onRideAcceptedListener && !this.localVals.startedListener && this.props.onDriverArrivedListener){
            this.props.onRideAcceptedListener(this.onRideAccepted);
            this.props.onDriverArrivedListener(this.onDriverArrived);
            this.localVals.startedListener = true;
        }

        else if (this.props.onDriverPaid && !this.localVals.startedListener) {
            this.props.onDriverPaid(this.onDriverPaid);
            this.localVals.startedListener = true;
        }
        console.log('trip rate')
        console.log(this.props.tripRate)
        return(
            <div className='RideProgressPage'>
                <Jumbotron fluid>
                    <h1 className='RideProgressPageHeader'>{this.props.role}</h1>
                </Jumbotron>
                <div className='RideDetails'>
                    <div className='Details'>
                        <span className='DetailContainer'><span className='DetailLabel' id='PickupDetails'>Pick Up Location: </span>{this.props.riderPickupAddress}</span>
                        <span className='DetailContainer'><span className='DetailLabel' id='DropOffDetails'>Drop Off Location: </span>{this.props.riderDropOffAddress}</span>
                    </div>
                </div>
                <div className='rideProgressPageCenter'>
                    {this.renderSpinner()}
                    {this.renderDriverButton()}
                    {this.renderDriverPayout()}
                </div>
            </div>
        )
    }
}

export default RideProgressPage;