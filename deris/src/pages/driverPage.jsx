import React from 'react';
import { ButtonWithLabelsList } from '../modules/lists.jsx'
import { SingleTextBox } from '../modules/textInputs.jsx'

/**
 * The module for the driver page
 * 
 * @param {object}  props       Properties passed in from the App. Should have 
 *                              onSubmit: function that takes payload 
 *                                  {
 *                                      center:         number, 
 *                                      radius:         number,
 *                                      jobInfo:        object
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
        }

        this.getRides = this.getRides.bind(this);
        this.onCenterLocChange =  this.onCenterLocChange.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
    }
    // update the centering location 
    onCenterLocChange(event) {
        this.setState({center: event.target.value});
    }
    // update the radius
    onRadiusChange(event) {
        this.setState({radius: event.target.value});
    }
    // Getting rides from blockchain. Mock for now
    getRides() {
        return {
            elements:[
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '123 applewood road', '456 nutmeg avenue', '13'
                    ]
                },
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '802 fisherman road', '111 colorado avenue', '10'
                    ]
                },
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '910 lakeview blvd', '100 cold street', '29'
                    ]
                }, 
                {
                    buttonLabel: 'Accept',
                    labels: [
                        '992 montgomery street', '529 eisenhower blvd', '2'
                    ]
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
            </div>
        )
    }
}

export default DriverPage;