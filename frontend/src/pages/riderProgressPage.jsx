import React from 'react';
import { Jumbotron, ProgressBar } from 'react-bootstrap';
import'./styles/riderProgressPage.css'
import spinner from '../resources/spinner.gif'
import rideAcceptedSpinner from '../resources/oke.gif'
import hopIn from '../resources/hopin.gif'
import { SingleButton } from '../modules/buttonInputs'
import {metersToMiles} from '../js_modules/googleMapUtils'

const mockTimePerMile = 10; // every mile takes x amount of seconds

/**
 * 
 * @param {object} props 
 */
class RiderProgressPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSpinner: true,
            rideAccepted: false,
            driverArrived: false,
            tripStarted: false,
            timeToDriverArrival: 0,
            startTime: 0,
            remainingTime: 0,
            outOfTime: false,
            paid: 0,
        }
        this.localVals = {
            startedListener: false
        }
        this.onRideAccepted = this.onRideAccepted.bind(this);
        this.renderSpinner = this.renderSpinner.bind(this);
        this.onDriverArrived = this.onDriverArrived.bind(this);
        this.mockTrip = this.mockTrip.bind(this);
        this.payDriver = this.payDriver.bind(this);
        this.startTrip = this.startTrip.bind(this);
        this.calcRemainingTime = this.calcRemainingTime.bind(this);
        this.renderWaitingProgressBar = this.renderWaitingProgressBar.bind(this);
    }

    onRideAccepted(payload){
        const arrivalTime = parseFloat(payload.returnValues.arrivalTime);
        const incomingRiderNumber = payload.returnValues.riderNumber;
        if (this.props.riderNumber != incomingRiderNumber){
            return;
        }
        let startTime = Math.round(new Date().getTime() / 1000); // timestamp in seconds
        let timeToDriverArrival = parseInt(arrivalTime); // seconds 
        this.setState({showSpinner: false, rideAccepted: true, timeToDriverArrival, startTime})
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
        this.setState(prevState => ({
            paid: prevState.paid + amount
        }));
    }

    startTrip(){
        this.setState({tripStarted: true});
        this.mockTrip();
    }

    mockTrip(){
        console.log('mocking trip')
        let totalTripDistance = 0; // meters

        console.log('DIRECTIONS')
        console.log(this.props.directions)
        const route = this.props.directions.routes[0].legs[0];

        for (let leg of route. steps){
            totalTripDistance += leg.distance.value;
        }
        
        const totalPayout = this.props.tripRate;
        let runningPayout = 0;

        // execute payoutLeg after sleep tim

        const setDelay = (func, value, time) => {
            setTimeout(() => {
                func(value)
            }, time)
        }
        
        for (let leg of route.steps){
            const sleepTime = Math.round(metersToMiles(leg.distance.value) * mockTimePerMile * 1000);// ms to seconds
          
            console.log(leg)
            let percentTraveled =  (leg.distance.value / totalTripDistance);
            let thisPayout = Math.floor(totalPayout * percentTraveled);

            if (thisPayout + runningPayout > totalPayout){
                // pay the remaining
                setDelay(this.payDriver, totalPayout-runningPayout, sleepTime);
            }
            else {
                // pay this payout
                setDelay(this.payDriver, thisPayout, sleepTime)
            }
            runningPayout += thisPayout;
              
        }

        // check to see if there is any remaining money to pay out
        if (totalPayout - runningPayout > 0){
            // pay the difference
            this.payDriver(totalPayout - runningPayout)
        }
    }

    renderWaitingProgressBar(){
        const now = Math.round(new Date().getTime() / 1000);
        const timeRan = Math.round(this.state.timeToDriverArrival - now);
        const totalTime = Math.round(this.state.timeToDriverArrival - this.state.startTime);
        
        const percent = timeRan * 100 / totalTime;

        return (
            <div className="progressBarContainer">
                <div><b>Time till driver arrives:</b></div>
                <ProgressBar animated variant="warning" now={percent} label={`${this.state.remainingTime}s`}></ProgressBar>
            </div>
        )
    }

    // render the spinner while waiting
    renderSpinner(){
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
                <div>
                    {this.renderWaitingProgressBar()}
                </div>
            )
            
        }
        else if (this.state.driverArrived && !this.state.tripStarted){
            return (
                <div className="driverArrived">
                    <div><b>Driver arrived! Hop in!</b></div>
                    <img className="spinner" src={hopIn} alt="Loading..."></img>
                    <SingleButton
                        label={'Start Trip'}
                        onClick={this.startTrip}
                    ></SingleButton>
                </div>
            )
        }
        else if (this.state.tripStarted){
            const percent = parseInt(this.state.paid * 100/this.props.tripRate);
            return (
                <div className="progressBarContainer">
                    <ProgressBar animated variant="warning" now={percent} label={`${percent}%`}/>
                </div>
            )
        }
    }

    calcRemainingTime(){
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = this.state.timeToDriverArrival - now;

        this.setState({remainingTime});
    }

    render() {
        if (!this.props.show){
            return (<div className="empty"></div>)
        }

        if(this.props.onRideAcceptedListener && !this.localVals.startedListener && this.props.onDriverArrivedListener){
            this.props.onRideAcceptedListener(this.onRideAccepted);
            this.props.onDriverArrivedListener(this.onDriverArrived);
            this.localVals.startedListener = true;
        }

        if (this.state.rideAccepted && !this.state.driverArrived){
            setTimeout(this.calcRemainingTime, 1000);
        }

        return(
            <div className='RiderProgressPage'>
                <Jumbotron fluid>
                    <h1 className='RiderProgressPageHeader'>RIDER</h1>
                </Jumbotron>
                <div className='RiderDetails'>
                    <div className='Details'>
                        <span className='DetailContainer'><span className='DetailLabel' id='PickupDetails'>Pick Up Location: </span>{this.props.riderPickupAddress}</span>
                        <span className='DetailContainer'><span className='DetailLabel' id='DropOffDetails'>Drop Off Location: </span>{this.props.riderDropOffAddress}</span>
                    </div>
                </div>
                <div className='RiderProgressPageCenter'>
                    {this.renderSpinner()}
                </div>
            </div>
        )
    }
}

export default RiderProgressPage;