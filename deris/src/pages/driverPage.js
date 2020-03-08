import React from 'react';
import { ButtonWithLabelsList } from './../modules/lists.js'

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
            <ButtonWithLabelsList
                elements={elements.elements}
            ></ButtonWithLabelsList>
        )
    }
}

export default DriverPage;