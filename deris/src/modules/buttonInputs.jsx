import React from 'react';

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
    return (
        <table>
        <tbody class="buttonWithLabels">
            <tr>
                { props.labels.map( el =>
                    <td key={el}>{el}</td>
                )}
                <td>
                    <button 
                        class="rightEndButton" 
                        onClick={props.onClick} 
                        key={'button__'+props.buttonLabel}
                        value={props.labels.join(sep)}
                        >{props.buttonLabel}</button>
                </td>
            </tr>
        </tbody>
        </table>
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
        <button onClick={props.onClick}>{props.label}</button>
    )
}

export {
    ButtonWithLabels,
    SingleButton
}