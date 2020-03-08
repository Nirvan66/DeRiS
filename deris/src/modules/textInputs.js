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

/**
 * Function for displaying two text boxes with two buttons. Stateless
 * 
 * @param {object} props    The properties from a higher power.
 *                          Should be of the form
 *                          {
 *                              inputFieldOne:      {label: string}
 *                              inputFieldTwo:      {label: string}
 *                              primaryButton:      {submitFunction: callable, label: string}
 *                              secondaryButton:    {submitFunction: callable, label: string}
 *                              onChange:           callable
 *                          }
 *                          
 *@returns {React DOM element}
 */
function TwoButtonTwoTextSubmission (props){
    return (
        <form onSubmit={props.primaryButton.submitFunction}>
        <label>{props.inputFieldOne.label}</label>
        <input type="text" name={props.inputFieldOne.label} onChange={props.onChange}/>

        <label>{props.inputFieldTwo.label}</label>
        <input type="text" name={props.inputFieldTwo.label} onChange={props.onChange}/>

        <button type="submit">{props.primaryButton.label}</button>
        <button onClick={props.secondaryButton.submitFunction}>{props.secondaryButton.label}</button>
        </form>
    );
}

export  {
    TwoButtonTextSubmission,
    TwoButtonTwoTextSubmission
}