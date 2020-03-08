import React from 'react';
import { ButtonWithLabels } from './../modules/buttonInputs.js'

class DriverPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            center: null,
            radius: null,
            jobInfo: null,
        }
    }

    render() {
        if (!this.props.show){
            return (<div class="empty"></div>)
        }
        return (
            <ButtonWithLabels
                buttonLabel='dumbButton'
                labels={['fish', 'cow', 'dog']}
                onClick={() => {alert('oooo my button')}}
            ></ButtonWithLabels>
        )
    }
}

export default DriverPage;