import React from 'react';

export function DisclaimerBox({ title, children }) {
  return (
    <div className="disclaimer-box">
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
