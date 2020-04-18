import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import'./styles/rideProgressPage.css'
import spinner from '../resources/spinner.gif'

/**
 * 
 * @param {object} props 
 */
class RideProgressPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showSpinner: true,
        }
        this.localVals = {
            startedListener: false
        }
        this.onRideAccepted = this.onRideAccepted.bind(this);
        this.renderSpinner = this.renderSpinner.bind(this);
    }

    onRideAccepted(payload){
        console.log('IN IN HERE BIG BIG BOI')
        console.log(payload);

        this.setState({showSpinner: false})
    }

    renderSpinner(){
        if(this.props.role == 'rider' && !this.state.showSpinner){
            console.log('hullo were here')
            return (
                <div><b>Your ride has arrived</b></div>
            )
        }
        else if (this.props.role != 'rider' || !this.state.showSpinner){
            console.log('role')
            console.log(this.props.role)
            console.log('show sp')
            console.log('oopsie if your a rider ')
            return (
                <div></div>
            )
        }
        return (
            <img class="spinner" src={spinner} alt="Loading..."></img>
        )
    }

    render() {
        if (!this.props.show){
            return (<div class="empty"></div>)
        }

        if(this.props.role == 'rider' && this.props.onRideAcceptedListener && !this.localVals.startedListener){
            this.props.onRideAcceptedListener(this.onRideAccepted);
            this.localVals.startedListener = true;
        }

        return(
            <div class='RideProgressPage'>
                <Jumbotron fluid>
                    <h1 class='RideProgressPageHeader'>{this.props.role}</h1>
                </Jumbotron>
                <div class='RideDetails'>
                    <div class='Details'>
                        <span class='DetailContainer'><span class='DetailLabel' id='PickupDetails'>Pick Up Location: </span>{this.props.riderPickupAddress}</span>
                        <span class='DetailContainer'><span class='DetailLabel' id='DropOffDetails'>Drop Off Location: </span>{this.props.riderDropOffAddress}</span>
                    </div>
                </div>
                {this.renderSpinner()}

            </div>
        )
    }
}

export default RideProgressPage;