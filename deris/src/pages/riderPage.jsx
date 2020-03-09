import React from 'react';
import { TwoButtonTwoTextSubmission } from '../modules/textInputs.jsx'
/**
 * The module for the rider page
 * 
 * @param {object}  props       Properties passed in from the App. Should have 
 *                              onSubmit: function that takes payload 
 *                                  {
 *                                      startLocation:  string, 
 *                                      endLocation:    string,
 *                                      requestType:    string
 *                                  }
 *                                  request type is either 'request' or 'cancel'
 *                              show: boolean to render the page
 * 
 * @returns {React.Component}   The react component for the entire page
 */
class RiderPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            startLocation: '',
            endLocation: '',

        }

        this.onChange = this.onChange.bind(this);
        this.onRequestSubmit = this.onRequestSubmit.bind(this);
        this.onCancelSubmit = this.onCancelSubmit.bind(this);
    }
    // keep tracking the user input to use for submission. need to discern by name
    onChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }
    // submit functions for the request and cancel buttons
    onRequestSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({
            startLocation:  this.state.startLocation,
            endLocation:    this.state.endLocation,
            requestType:    'request'
        });
    }
    onCancelSubmit(event) {
        event.preventDefault();
        this.props.onSubmit({
            startLocation:  this.state.startLocation,
            endLocation:    this.state.endLocation,
            requestType:    'cancel'
        });
    }

    render() {
        if (!this.props.show){
            return (<div class="empty"></div>)
        }
        const inputFieldOne = {label: 'Pick-up Location'};
        const inputFieldTwo = {label: 'Drop-off Location'};
        const primaryButton = {submitFunction: this.onRequestSubmit, label: 'Request'};
        const secondaryButton = {submitFunction: this.onCancelSubmit, label: 'Cancel'};

        return (
            <TwoButtonTwoTextSubmission
                inputFieldOne={inputFieldOne}
                inputFieldTwo={inputFieldTwo}
                primaryButton={primaryButton}
                secondaryButton={secondaryButton}
                onChange={this.onChange}
            ></TwoButtonTwoTextSubmission>
        )
    }
}

export default RiderPage;