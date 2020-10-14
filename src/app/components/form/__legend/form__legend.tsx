import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Form__Legend: React.FC<propType> = ({children}) => {
  return (
    <legend className="form__legend">
      {children}
    </legend>
  );
}

export default Form__Legend;
