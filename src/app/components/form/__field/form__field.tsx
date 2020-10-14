import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Form__Field: React.FC<propType> = ({children}) => {
  return (
    <div className="form__field">
      {children}
    </div>
  );
}

export default Form__Field;
