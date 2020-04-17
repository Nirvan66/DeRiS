import React from 'react';
import { Table, Button } from 'react-bootstrap';

/**
 * Generate a single element with labels of information 
 * @param {object} props    properties from caller. Should have the following attributes
 *                          {
 *                              labels:     array of strings
 *                              onClick:    callable
 *                              buttonLabel: string
 *                          }         
 *                          Data for the button selected kept in target.value
 *                          labels seperated by the separator /?/
 * @returns {React DOM element}
 */
function ButtonWithLabels(props) {
    const sep = '/?/';
    console.log('PROPS IN BUTTON WITH LABELS')
    console.log(props)
    return (
        <Table bordered>
        <tbody class="ButtonWithLabels">
            <tr>
                { props.labels.map( el =>
                    <td key={el}>{el}</td>
                )}
                <td class="ButtonWithLabelsButtonContainer">
                    <Button 
                        class="rightEndButton" 
                        onClick={props.onClick} 
                        key={'button__'+props.buttonLabel}
                        value={props.labels.join(sep)}
                        >{props.buttonLabel}
                    </Button>
                </td>
            </tr>
        </tbody>
        </Table>
    )
}

/**
 * Function for a single button element
 * 
 * @param {object} props    properties from the caller. Should have the following attributes
 *                          {
 *                              label:      string
 *                              onClick:    callable
 *                          }
 */
function SingleButton(props) {
    return (
        <div class='SingleButtonContainer'>
            <Button size="lg"
                onClick={props.onClick}
            >{props.label}</Button>
        </div>
    )
}

export {
    ButtonWithLabels,
    SingleButton
}