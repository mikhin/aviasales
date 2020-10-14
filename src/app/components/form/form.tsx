import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Form: React.FC<propType> = ({children}) => {
  return (
    <form className="form">
      {children}
    </form>
  );
}

export default Form;
