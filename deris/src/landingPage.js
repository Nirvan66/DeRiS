import React from 'react';
import {TwoButtonTextSubmission} from './modules/textInputs'

// Class for the entire landing page. Shows a header and receives input for the address
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
        this.props.onSubmit({ethereumAddress: this.state.ethereumAddress, type: 'rider'});
    }
    onDriverSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({ethereumAddress: this.state.ethereumAddress, type: 'driver'});
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
        return (
            <div class='LandingPage'>
                <div class='DerisHeader'>DERIS</div>
                <div class='AddressInputContainer'>{this.renderAddressInput()}</div>
            </div>
            
        )
    }
}

export default LandingPage;