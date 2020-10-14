import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Form__FieldSet: React.FC<propType> = ({children}) => {
  return (
    <fieldset className="form__field-set">
      {children}
    </fieldset>
  );
}

export default Form__FieldSet;
