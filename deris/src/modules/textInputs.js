import React from 'react';

/** 
 * Function for displaying a text box and two buttons. Stateless
 * 
 * @param {object} props    The properties from a higher power. 
 *                          Should contain two types of buttons labels of the form
 *                          {
 *                              primary:    {submitFunction: callable, label: string},
 *                              secondary:  {submitFunction: callable, label: string}
 *                              onChange:   callable
 *                          }
 * 
 * @return {React DOM element}
*/
function TwoButtonTextSubmission (props){
    return (
        <form onSubmit={props.primary.submitFunction}>
        <label>
            <input type="text" onChange={props.onChange}/>
        </label>
        <button type="submit">{props.primary.label}</button>
        <button onClick={props.secondary.submitFunction}>{props.secondary.label}</button>
        </form>
    );
}

export  {
    TwoButtonTextSubmission
}