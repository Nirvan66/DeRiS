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
            return (<div class="empy"></div>)
        }
        return (
            <div
                class="invalidTextInputErrorContainer"
            >
                 <div class="InvalidTextInputError"
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