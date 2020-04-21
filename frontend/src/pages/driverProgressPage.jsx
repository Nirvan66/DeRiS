import React from 'react';
import { Jumbotron, ProgressBar } from 'react-bootstrap';
import'./styles/driverProgressPage.css'
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
class DriverProgressPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSpinner: true,
            rideAccepted: false,
            riderInformed: false,
            paid: 0,
            startTime: 0,
            remainingTime: 0,
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
    }

    onDriverPaid(payload){
        const {driverNumber, bills} = payload.returnValues;
        console.log('Driver paid function')
        console.log(driverNumber + '\n' + bills);
        // TODO: check driver number
        const nextPayment = parseInt(bills);
        this.setState(prevState => ({paid: prevState.paid += nextPayment}));
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
    
        this.props.informRider(dummyLoc, this.props.ethereumAddress);
        this.setState({riderInformed: true})
    }

    renderDriverButton(){
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

    renderDriverPayout(){
        if (this.state.riderInformed){
            const amountPaid = this.state.paid == null ? 0 : this.state.paid;
            const percent = Math.round(amountPaid*100/this.props.tripRate);
            return (
                <div className="progressBarContainer">
                    <ProgressBar animated variant="warning" now={percent} label={`${percent}%`}/>
                </div>
            )
        }
    }

    renderTimeToArrival(){
        if (this.state.riderInformed){
            return (<div></div>)
        }
        const now = Math.round(new Date().getTime() / 1000);
        const timeRan = Math.round(this.props.arrivalTime - now);
        const totalTime = Math.round(this.props.arrivalTime - this.state.startTime);
        
        const percent = timeRan * 100 / totalTime;

        return (
            <div className="arrivalTimeProgressBarContainer">
                <ProgressBar animated variant="warning" now={percent} label={`${this.state.remainingTime}s`}/>
            </div>
        )
    }

    calcTimeToArrival(){
        const now = Math.round(new Date().getTime() / 1000);
        const remainingTime = this.props.arrivalTime - now;
        

        if (this.state.startTime == 0){
            const startTime = Math.round(new Date().getTime() / 1000);
            this.setState({startTime});
        }
        else {
            this.setState({remainingTime});
        }
    }


    render() {
        if (!this.props.show){
            return (<div className="empty"></div>)
        }

        if (this.props.onDriverPaid && !this.localVals.startedListener) {
            this.props.onDriverPaid(this.onDriverPaid);
            this.localVals.startedListener = true;
        }

        if (!this.state.riderInformed){
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
                </div>
            </div>
        )
    }
}

export default DriverProgressPage;