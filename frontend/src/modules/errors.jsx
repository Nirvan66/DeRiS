import React from 'react';

/**
 * 
 * @param {object} props should have properties 
 *                              errorMessage:   string
 *                              show:           boolean
 */
import './styles/errors.css'

 class InvalidTextInputError extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        console.log('Show is ' + this.props.show)
        if (!this.props.show){
            return (<div className="empty"></div>)
        }
        return (
            <div
                className="invalidTextInputErrorContainer"
            >
                 <div className="InvalidTextInputError"
                 >
                     <p>{this.props.errorMessage}</p>
                 </div>
            </div>
        );
    }
}

export {
    InvalidTextInputError
}