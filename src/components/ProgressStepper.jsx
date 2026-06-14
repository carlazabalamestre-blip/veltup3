import React from 'react';

export function ProgressStepper({ steps, active }) {
  return (
    <div className="progress-stepper" role="progressbar" aria-valuenow={active} aria-valuemin="1" aria-valuemax={steps.length}>
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        const status = stepIndex < active ? 'completed' : stepIndex === active ? 'active' : '';
        return (
          <div key={step} className={`progress-step ${status}`}>
            {stepIndex}. {step}
          </div>
        );
      })}
    </div>
  );
}
