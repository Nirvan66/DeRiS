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
            tripEnded: false,
            driverCancelled: false,
            needsReset: false,
            feeFromDriverCancel: 0,
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
        this.cancelTrip = this.cancelTrip.bind(this);
        this.tripEnded = this.tripEnded.bind(this);
        this.renderSummary = this.renderSummary.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    resetState(){
        this.localVals = {
            startedListener: false
        }
        this.setState({
            showSpinner: true,
            rideAccepted: false,
            driverArrived: false,
            tripStarted: false,
            timeToDriverArrival: 0,
            startTime: 0,
            remainingTime: 0,
            outOfTime: false,
            paid: 0,
            tripEnded: false,
            driverCancelled: false,
            needsReset: false,
        });
    }

    tripEnded(payload){
        console.log('TRIP ENDED IN RIDER PAGE. PAYLOAD')
        console.log(payload)
        if (payload && payload.returnValues.pairNumber
            && (payload.returnValues.pairNumber == this.props.riderNumber
                || (payload.returnValues.usrNumber == this.props.riderNumber &&  this.state.paid == this.props.tripRate))){
            let driverCancelled = this.state.paid == this.props.tripRate ? false : true;
            const cancelFee = payload.returnValues.cancelFee ? payload.returnValues.cancelFee : 0;
            this.setState({
                tripEnded: true,
                driverCancelled,
                feeFromDriverCancel: cancelFee,
            })
        }
    }

    cancelTrip(){
        if (!this.props.cancelTrip){
            return;
        }
        if (this.state.rideAccepted){
            // rider will lose money
            if(window.confirm('Are you sure you want to cancel? You will lose any money paid to the driver so far.')){
                this.props.cancelTrip();
            }
        }
        else {
            // rider will not lose money
            if(window.confirm('Are you sure you want to cancel? You will not be penalized for cancelling at this time.')){
                this.props.cancelTrip();
            }
        }
    }

    onRideAccepted(payload){
        const arrivalTime = parseFloat(payload.returnValues.arrivalTime);
        const incomingRiderNumber = parseInt(payload.returnValues.riderNumber);

        if (this.props.riderNumber != incomingRiderNumber){
            console.log('Incoming rider number ' + incomingRiderNumber + ' does not match my rider number ' + this.props.riderNumber)
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
        if (!this.state.tripStarted || this.state.tripEnded){
            return;
        }
        const startTime = new Date().getTime();
        this.props.payDriver(amount, this.props.ethereumAddress);
        console.log('time for pay driver')
        console.log(new Date().getTime() - startTime)
        let tripEnded = false;
        console.log("TOTAL AMOUNT IN PAY DRIVER")
        console.log(this.state.paid + amount)
        if (this.state.paid + amount >= this.state.tripRate){
            console.log("CHANGING TRIP ENDED")
            tripEnded = true;
        }
        this.setState(prevState => ({
            paid: prevState.paid + amount,
            tripEnded,
        }));
    }

    startTrip(){
        this.setState({tripStarted: true, needsReset: true});
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
        setDelay(() => {
            if (totalPayout - runningPayout > 0){
                // pay the difference
                this.payDriver(totalPayout - runningPayout)
            }
        }, totalTripDistance * mockTimePerMile * 1000)


    }

    renderSummary(){
        if (this.state.tripEnded){
            return (
                <div className="summaryContainer">
                    {this.state.driverCancelled &&
                        <div className="driverCancelledContainer">
                            <p>Driver cancelled the trip.</p>
                            <p>Fee recieved from cancellation: {this.state.feeFromDriverCancel}</p>
                        </div>
                    }
                    {!this.state.driverCancelled &&
                        <div className="amountPaidContainer">
                            <p>Ride Complete!</p>
                            <p>Trip cost: {this.state.paid}</p>
                        </div>
                    }
                    <div className="backToLoginButtonContainer">
                        <SingleButton
                            label="Back to login page"
                            onClick={this.props.toLoginPage}
                        ></SingleButton>
                    </div>
                </div>
            )
        }
    }

    renderWaitingProgressBar(){
        if (this.state.tripEnded){
            return;
        }
        const now = Math.round(new Date().getTime() / 1000);
        const timeRan = Math.round(this.state.timeToDriverArrival - now);
        const totalTime = Math.round(this.state.timeToDriverArrival - this.state.startTime);

        const percent = timeRan * 100 / totalTime;

        return (
            <div className="progressBarContainer">
                <div><b>Time till driver arrives:</b></div>
                <ProgressBar animated variant="warning" now={percent} label={`${this.state.remainingTime}s`}></ProgressBar>
                <img className="spinner" src={rideAcceptedSpinner} alt="Loading..."></img>
            </div>
        )
    }

    // render the spinner while waiting
    renderSpinner(){
        if (this.state.tripEnded){
            return;
        }
        if (!this.state.needsReset){
            this.setState({needsReset: true})
        }
        if (this.state.showSpinner) {
            return (
                <div className="rideSubittedWaiting">
                    <img className="spinner" src={spinner} alt="Loading..."></img>
                    <div><b>Ride Submitted! Waiting for a driver to accept your trip...</b></div>
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
                <div className="tripProgressContainer">
                    Trip Progress:
                    <div className="progressBarContainer">
                        <ProgressBar animated variant="warning" now={percent} label={`${percent}%`}/>
                    </div>
                </div>

            )
        }
    }

    calcRemainingTime(){
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = this.state.timeToDriverArrival - now;

        this.setState({remainingTime, needsReset: true});
    }

    render() {
        if (!this.props.show){
            if (this.state.needsReset){
                this.resetState();
            }
            return (<div className="empty"></div>)
        }

        // Start all listeners
        if(!this.localVals.startedListener){
            if(this.props.onRideAcceptedListener){
                this.props.onRideAcceptedListener(this.onRideAccepted);
            }
            if(this.props.onDriverArrivedListener){
                this.props.onDriverArrivedListener(this.onDriverArrived);
            }
            if (this.props.onTripEndedListener){
                this.props.onTripEndedListener(this.tripEnded);
            }
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
                    <table>
                        <tbody>
                          <tr>
                              {
                                  !this.state.tripEnded &&
                                  <div className="cancelButtonContainer">
                                      <SingleButton
                                          label="Cancel"
                                          onClick={this.cancelTrip}
                                      ></SingleButton>
                                  </div>
                              }
                          </tr>
                            <tr>
                                <td>
                                    {this.renderSpinner()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {this.renderSummary()}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}

export default RiderProgressPage;
