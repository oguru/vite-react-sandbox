import React from 'react';
import PropTypes from 'prop-types';
import './stepper.css';

export const Stepper = ({ activeStep, steps }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={`stepper-item ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
        >
          <div className="stepper-circle">{index + 1}</div>
          <div className="stepper-label">{step.label}</div>
          {index < steps.length - 1 && <div className="stepper-line" />}
        </div>
      ))}
    </div>
  );
};

Stepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

Stepper.defaultProps = {
  activeStep: 0,
}; 