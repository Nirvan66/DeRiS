import React from 'react';

/**
 * 
 * @param {object} props 
 */
class RideProgressPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }


    render() {
        if (!this.props.show){
            return (<div class="empty"></div>)
        }
        return(
            <div>Howdy</div>
        )
    }
}

export default RideProgressPage;