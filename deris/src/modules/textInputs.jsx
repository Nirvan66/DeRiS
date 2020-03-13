import React from 'react';
import { Form, Button } from 'react-bootstrap';

/**
 * Function for displaying a single text box with no submit function just onChange function
 * 
 * @param {object} props    Properties from a higher power.
 *                          Should contain the following:
 *                          {
 *                              onChange:   callable
 *                              label:      string
 *                          }
 * 
 * @returns {React DOM element}
 */
function SingleTextBox (props) {
    return (
        <form>
            <label>{props.label}</label>
            <input type="text" onChange={props.onChange}/>
        </form>
    )
}

/** 
 * Function for displaying a text box and two buttons. Stateless
 * 
 * @param {object} props    The properties from a higher power. 
 *                          Should contain two types of buttons labels of the form
 *                          {
 *                              primary:    {submitFunction: callable, label: string},
 *                              secondary:  {submitFunction: callable, label: string}
 *                              onChange:   callable
 *                              inputLabel: string
 *                          }
 * 
 * @return {React DOM element}
*/
function TwoButtonTextSubmission (props){
    return (
        <Form onSubmit={props.primary.submitFunction}> 
            <Form.Group controlId="formBasicPassword">
                <Form.Label>{props.inputLabel}</Form.Label>
                <Form.Control onChange={props.onChange}/>
            </Form.Group>
            <div class="TwoButtonTextSubmissionButtonContainer">
                <Button class="PrimaryButton" type="submit" size="lg" block>{props.primary.label}</Button>
                <Button class="SecondaryButton" size="lg" onClick={props.secondary.submitFunction} block>{props.secondary.label}</Button>
            </div>
        </Form>
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
        <div class="TwoButtonTwoTextSubmissionContainer">
            <Form onSubmit={props.primaryButton.submitFunction}> 
                <Form.Group>
                    <Form.Label>{props.inputFieldOne.label}</Form.Label>
                    <Form.Control name={props.inputFieldOne.label} onChange={props.onChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>{props.inputFieldTwo.label}</Form.Label>
                    <Form.Control name={props.inputFieldTwo.label} onChange={props.onChange}/>
                </Form.Group>
                <div class="TwoButtonTwoTextSubmissionButtonContainer">
                    <Button class="PrimaryButton" type="submit" size="lg">{props.primaryButton.label}</Button>
                    <Button class="SecondaryButton" size="lg" onClick={props.secondaryButton.submitFunction} >{props.secondaryButton.label}</Button>
                </div>
            </Form>
        </div>
    );
}

export  {
    TwoButtonTextSubmission,
    TwoButtonTwoTextSubmission,
    SingleTextBox
}