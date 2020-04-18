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
        <div className="buttonWithLabelsListContainer">
            { props.elements.map( el =>
                    <ButtonWithLabels
                        buttonLabel={el.buttonLabel}
                        labels={el.labels}
                        onClick={el.onClick}
                        key={el.labels[0]}
                    ></ButtonWithLabels>
                )}
        </div>
    )
}

export {
    ButtonWithLabelsList
}