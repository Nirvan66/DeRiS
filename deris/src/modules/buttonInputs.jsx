import React from 'react';

/**
 * Generate a single element with labels of information 
 * @param {object} props    properties from caller. Should have the following attributes
 *                          {
 *                              labels:     array of strings
 *                              onClick:    callable
 *                              buttonLabe: string
 *                          }         
 * @returns {React DOM element}
 */
function ButtonWithLabels(props) {
    return (
        <table>
        <tbody class="buttonWithLabels">
            <tr>
                { props.labels.map( el =>
                    <td key={el}>{el}</td>
                )}
                <td>
                    <button class="rightEndButton" onClick={props.onClick}>{props.buttonLabel}</button>
                </td>
            </tr>
        </tbody>
        </table>
    )
}

export {
    ButtonWithLabels
}