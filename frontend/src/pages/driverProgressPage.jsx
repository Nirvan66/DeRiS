import React from 'react';
import { Jumbotron, ProgressBar } from 'react-bootstrap';
import'./styles/driverProgressPage.css'
import spinner from '../resources/spinner.gif'
import { SingleButton } from '../modules/buttonInputs'
import {metersToMiles} from '../js_modules/googleMapUtils'


/**
 *
 * @param {object} props
 */
class DriverProgressPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSpinner: true,
            riderInformed: false,
            paid: 0,
            startTime: 0,
            remainingTime: 0,
            tripEnded: false,
            showSummary: false,
            riderCancelled: false,
            needsReset: false,
        }
        this.localVals = {
            startedListener: false
        }
        this.renderSpinner = this.renderSpinner.bind(this);
        this.renderDriverButton = this.renderDriverButton.bind(this);
        this.informRider = this.informRider.bind(this);
        this.renderDriverPayout = this.renderDriverPayout.bind(this);
        this.onDriverPaid = this.onDriverPaid.bind(this);
        this.calcTimeToArrival = this.calcTimeToArrival.bind(this);
        this.cancelTrip = this.cancelTrip.bind(this);
        this.tripEnded = this.tripEnded.bind(this);
        this.renderSummary = this.renderSummary.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    resetState(){
        this.localVals = {
            startedListener: false
        }
        this.setState(this.state = {
            showSpinner: true,
            riderInformed: false,
            paid: 0,
            startTime: 0,
            remainingTime: 0,
            tripEnded: false,
            showSummary: false,
            riderCancelled: false,
            needsReset: false,
        });
    }

    tripEnded(payload){
        if (payload && payload.returnValues.pairNumber && payload.returnValues.pairNumber != this.props.driverNumber){
            return;
        }
        if (!this.state.tripEnded){
            // rider cancelled early
            const cancelFee = payload.returnValues.cancelFee ? payload.returnValues.cancelFee : 0;
            this.setState({tripEnded: true, showSummary: true, riderCancelled: true, needsReset: true, paid: cancelFee});
        }
        else {
            // paid in full
            this.setState({tripEnded: true, showSummary: true, needsReset: true});
        }
    }

    cancelTrip(payload){
        if (!this.props.cancelTrip){
            return;
        }
        if (payload && payload.fromTimeOut){
            this.props.cancelTrip();
        }
        else if (this.state.riderInformed && this.state.startTime != 0){
            if(window.confirm('Are you sure you want to cancel? The rider will stop paying you if you do.')){
                this.resetState();
                this.props.cancelTrip();
            }
        }
        else {
            if (window.confirm('Are you sure you want to cancel? You will lose your deposit.')){
                this.resetState();
                this.props.cancelTrip();
            }
        }
    }

    onDriverPaid(payload){
        const {driverNumber, bills} = payload.returnValues;
        // dont accept a payment thats not mine
        if (driverNumber != this.props.driverNumber){
            return;
        }
        const nextPayment = parseInt(bills);
        const tripEnded = nextPayment + this.state.paid >= this.props.tripRate;
        this.setState(prevState => ({paid: prevState.paid += nextPayment, tripEnded}));
    }

    // render the spinner while waiting
    renderSpinner(){
        return (<div></div>)
    }

    informRider(){
        // dummy location to pass just for now
        // for mocking purposes, we say the driver is right there
        const dummyLoc = {
            lat: this.props.riderPickupLocation.lat(),
            lng: this.props.riderPickupLocation.lng(),
        }
        const startTime = new Date().getTime();
        this.props.informRider(dummyLoc, this.props.ethereumAddress);
        console.log('time to inform rider')
        console.log(new Date().getTime() - startTime)
        this.setState({riderInformed: true})
    }

    renderSummary(){
        if (this.state.tripEnded) {
            return (
                <div className="summaryContainer">
                    {
                        !this.state.riderCancelled &&
                        <div className="rideCompleteName">
                            Ride Complete!
                        </div>
                    }
                    {
                        this.state.riderCancelled &&
                        <div className="riderCancelledContainer">
                            Rider cancelled
                        </div>
                    }
                    <div className="amountPaid">
                        Amount Recieved: {this.state.paid}
                    </div>
                    <div className="backToHomePageButtonContainer">
                        <SingleButton
                            label="Back to login page"
                            onClick={this.props.toLoginPage || window.location.reload}
                        ></SingleButton>
                    </div>
                </div>
            )
        }

    }

    renderDriverButton(){
        if (this.state.riderInformed || this.state.tripEnded){
            return (<div></div>)
        }
        return (
            <SingleButton className="informRiderButton"
                label='Inform Rider'
                onClick={this.informRider}
            ></SingleButton>
        )
    }

    renderDriverPayout(){
        if (this.state.riderInformed && !this.state.tripEnded){
            const amountPaid = this.state.paid == null ? 0 : this.state.paid;
            const percent = Math.round(amountPaid*100/this.props.tripRate);
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

    renderTimeToArrival(){
        if (this.state.riderInformed || this.state.tripEnded){
            return (<div></div>)
        }
        const now = Math.round(new Date().getTime() / 1000);
        const timeRan = Math.round(this.props.arrivalTime - now);
        const totalTime = Math.round(this.props.arrivalTime - this.state.startTime);

        const percent = timeRan * 100 / totalTime;

        return (
            <div>
                <div className="progressBarExplanation">
                    Time to arrive a rider's location:
                </div>
                <div className="arrivalTimeProgressBarContainer">
                    <ProgressBar animated variant="warning" now={percent} label={`${this.state.remainingTime}s`}/>
                </div>
                {this.state.remainingTime <= 60 &&
                    <div className="timeoutWarning">
                        You have {this.state.remainingTime}s to arrive or you will be penalized and returned to the home page
                    </div>
                }
            </div>
        )
    }

    calcTimeToArrival(){
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = this.props.arrivalTime - now;
        if (remainingTime <= 0){
            this.cancelTrip({fromTimeOut: true});
        }
        else if (this.state.startTime == 0){
            const startTime = Math.round(new Date().getTime() / 1000);
            this.setState({startTime, needsReset: true});
        }
        else {
            this.setState({remainingTime, needsReset: true});
        }
    }


    render() {
        if (!this.props.show){
            if (this.state.needsReset){
                this.resetState();
            }
            return (<div className="empty"></div>)
        }

        if (!this.localVals.startedListener){
            if (this.props.onDriverPaid){
                this.props.onDriverPaid(this.onDriverPaid);
            }
            if (this.props.onTripEndedListener){
                this.props.onTripEndedListener(this.tripEnded);
            }
            this.localVals.startedListener = true;
        }

        if (!this.state.riderInformed && !this.state.tripEnded){
            setTimeout(this.calcTimeToArrival, 1000);
        }

        return(
            <div className='DriverProgressPage'>
                <Jumbotron fluid>
                    <h1 className='DriverProgressPageHeader'>DRIVER</h1>
                </Jumbotron>
                <div className='DriverDetails'>
                    <div className='Details'>
                        <span className='DetailContainer'><span className='DetailLabel' id='PickupDetails'>Pick Up Location: </span>{this.props.riderPickupAddress}</span>
                        <span className='DetailContainer'><span className='DetailLabel' id='DropOffDetails'>Drop Off Location: </span>{this.props.riderDropOffAddress}</span>
                    </div>
                </div>
                <div className='DriverProgressPageCenter'>
                    {this.renderTimeToArrival()}
                    {this.renderDriverButton()}
                    {this.renderDriverPayout()}
                    {this.renderSummary()}
                    {
                        !this.state.tripEnded &&
                        <div className="cancelButtonContainer">
                            <SingleButton
                                label="Cancel"
                                onClick={this.cancelTrip}
                            ></SingleButton>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default DriverProgressPage;
