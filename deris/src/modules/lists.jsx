import React from 'react';
import { ButtonWithLabels } from './buttonInputs.jsx'

/**
 * Build a list of buttonWithLabels elements
 * 
 * @param {object} props    properties from caller. Has the attributes
 *                          {
 *                              elements:       list the following
 *                                  {   
 *                                      buttonLabel:    str,
 *                                      labels:         list of strings 
 *                                  }
 *                              onClick:        callable
 *                          }
 * @returns {React DOM element}
 */
function ButtonWithLabelsList(props) {
    return (
        <div class="buttonWithLabelsListContainer">
            { props.elements.map( el =>
                    <ButtonWithLabels
                        buttonLabel={el.buttonLabel}
                        labels={el.labels}
                        onClick={el.onClick}
                    ></ButtonWithLabels>
                )}
        </div>
    )
}

export {
    ButtonWithLabelsList
}