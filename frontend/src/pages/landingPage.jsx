import React from 'react';
import './styles/landingPage.css'
import { Jumbotron } from 'react-bootstrap';
import {TwoButtonTextSubmission} from '../modules/textInputs'
import { isValidAddress } from '../js_modules/ethereumUtils.js'

const INVALID_ADDRESS_MSG = 'ERROR: Ethereum address provided is not a valid address'

/**
 * The module for the landing page. Uses a two button submission
 * 
 * @param {object}  props       Properties passed in from the App. Should have a 
 *                              onSubmit:   function that takes payload {ethereumAddress: string, role: string}
 *                                          role is either 'rider' or 'driver'
 *                              show:       boolean to render the component
 *                              
 * 
 * @returns {React.Component}   The react component for the entire page
 */
class LandingPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            ethereumAddress: '',
            validEthereumAddress: true,
        }
        this.onChange = this.onChange.bind(this);
        this.onRiderSubmit = this.onRiderSubmit.bind(this);
        this.onDriverSubmit = this.onDriverSubmit.bind(this);
        this.checkAndSubmitAddress = this.checkAndSubmitAddress.bind(this);
    }
    // keep tracking the user input to use for submission
    onChange(event) {
        this.setState({ethereumAddress: event.target.value})
    }

    /**
     * Check if the ethereum is valid. if not, show a warning, otherwise pass it up
     * 
     * @param {string} role either 'rider' or 'driver' 
     */
    checkAndSubmitAddress(role){
        if (!isValidAddress(this.state.ethereumAddress) && !this.props.DEV){
            this.setState({
                ethereumAddress: null,
                validEthereumAddress: false
            })
        }
        else {
            this.props.onSubmit({ethereumAddress: this.state.ethereumAddress, role: role});
        }

    }

    // Do different things based on which button is clicked
    onRiderSubmit(event) {
        event.preventDefault();
        this.checkAndSubmitAddress('rider');
    }
    onDriverSubmit(event) {
        event.preventDefault();
        this.checkAndSubmitAddress('driver');
    }

    // render the input field
    renderAddressInput () {
        const primary = {
            submitFunction: this.onRiderSubmit, label: 'Rider'
        }
        const secondary = {
            submitFunction: this.onDriverSubmit, label: 'Driver'
        }
        return (
            <div className="LandingPageInputsContainer">
                <TwoButtonTextSubmission 
                    inputLabel="Ethereum Address"
                    primary={primary}
                    secondary={secondary}
                    onChange={this.onChange}
                    validInput={this.state.validEthereumAddress}
                    invalidInputMessage={INVALID_ADDRESS_MSG}
                ></TwoButtonTextSubmission>
            </div>
            
        )
    }
    render () {
        if (!this.props.show){
            return (<div className="emtpy"></div>)
        }
        return (
            <div className='LandingPage'>
                <Jumbotron fluid>
                    <h1 className='DerisHeader'>DERIS</h1>
                </Jumbotron>
                <div className='AddressInputContainer'>{this.renderAddressInput()}</div>
            </div>
            
        )
    }
}

export default LandingPage;