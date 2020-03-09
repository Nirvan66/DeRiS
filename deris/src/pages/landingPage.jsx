import React from 'react';
import {TwoButtonTextSubmission} from '../modules/textInputs'

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
            ethereumAddress: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onRiderSubmit = this.onRiderSubmit.bind(this);
        this.onDriverSubmit = this.onDriverSubmit.bind(this);
    }
    // keep tracking the user input to use for submission
    onChange(event) {
        this.setState({ethereumAddress: event.target.value})
    }

    // Do different things based on which button is clicked
    onRiderSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({ethereumAddress: this.state.ethereumAddress, role: 'rider'});
    }
    onDriverSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({ethereumAddress: this.state.ethereumAddress, role: 'driver'});
    }

    // render the input field
    renderAddressInput () {
        const primary = {
            submitFunction: this.onRiderSubmit, label: 'Rider'
        }
        const secondary = {
            submitFunction: this.onDriverSubmit, label: 'Driver'
        }
        return <TwoButtonTextSubmission 
                    primary={primary}
                    secondary={secondary}
                    onChange={this.onChange}
                ></TwoButtonTextSubmission>
    }
    render () {
        if (!this.props.show){
            return (<div class="emtpy"></div>)
        }
        return (
            <div class='LandingPage'>
                <div class='DerisHeader'>DERIS</div>
                <div class='AddressInputContainer'>{this.renderAddressInput()}</div>
            </div>
            
        )
    }
}

export default LandingPage;