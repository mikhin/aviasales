import React from 'react';

type Props = {
  children: React.ReactNode;
}

const Form__Legend: React.FC<Props> = ({children}) => {
  return (
    <legend className="form__legend">
      {children}
    </legend>
  );
}

export default Form__Legend;
