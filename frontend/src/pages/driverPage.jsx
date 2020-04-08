import React from 'react';
import './styles/driverPage.css'
import { ButtonWithLabelsList } from '../modules/lists.jsx'
import { SingleTextBox } from '../modules/textInputs.jsx'
import { SingleButton } from '../modules/buttonInputs.jsx'

/**
 * The module for the driver page
 * 
 * @param {object}  props       Properties passed in from the App. Should have 
 *                              onSubmit: function that takes payload 
 *                                  {
 *                                      center:         number, 
 *                                      radius:         number,
 *                                      jobInfo:        object,
 *                                      isCancel:       boolean
 *                                  }
 *                                  request type is either 'request' or 'cancel'
 *                              show: boolean to render the page
 * 
 * @returns {React.Component}   The react component for the entire page
 */
class DriverPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            center: null,
            radius: null,
            jobInfo: null,
            isCancel: false
        }

        this.getRides = this.getRides.bind(this);
        this.onCenterLocChange =  this.onCenterLocChange.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
        this.onJobAccept = this.onJobAccept.bind(this);
        this.onCancelSubmit = this.onCancelSubmit.bind(this);
    }
    // update the centering location 
    onCenterLocChange(event) {
        event.preventDefault();
        this.setState({center: event.target.value});
    }
    // update the radius
    onRadiusChange(event) {
        event.preventDefault();
        this.setState({radius: event.target.value});
    }
    // return the job details from the list item clicked
    onJobAccept(event) {
        const sep = '/?/';
        const state = this.state;
        event.preventDefault();

        const jobInfo = event.target.value.split(sep);
        state.isCancel = false;
        state.jobInfo = jobInfo;

        // pass the data back up to the caller
        this.props.onSubmit(state);
    }
    // handle the cancel button 
    onCancelSubmit(event) {
        event.preventDefault();
        const state = this.state;
        state.isCancel = true;
        this.props.onSubmit(state);
    }
    // Getting rides from blockchain. Mock for now
    getRides() {
        return {
            elements:[
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '123 applewood road', '456 nutmeg avenue', '13'
                    ],
                    onClick: this.onJobAccept
                },
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '802 fisherman road', '111 colorado avenue', '10'
                    ],
                    onClick: this.onJobAccept
                },
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '910 lakeview blvd', '100 cold street', '29'
                    ],
                    onClick: this.onJobAccept
                }, 
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '992 montgomery street', '529 eisenhower blvd', '2'
                    ],
                    onClick: this.onJobAccept
                }
            ]

        }
    }

    render() {
        if (!this.props.show){
            return (<div class="empty"></div>)
        }
        const elements = this.getRides();
        return (
            <div class="driverPageContainer">
                <SingleTextBox
                    label='Location'
                    onChange={this.onCenterLocChange}
                ></SingleTextBox>
                <SingleTextBox
                    label='Radius'
                    onChange={this.onRadiusChange}
                ></SingleTextBox>
                <ButtonWithLabelsList
                    elements={elements.elements}
                ></ButtonWithLabelsList>
                <SingleButton
                    onClick={this.onCancelSubmit}
                    label='Cancel'
                ></SingleButton>
            </div>
        )
    }
}

export default DriverPage;