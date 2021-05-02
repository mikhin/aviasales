import React from 'react';

type Props = {
  children: React.ReactNode;
}

const Form__FieldSet: React.FC<Props> = ({children}) => {
  return (
    <fieldset className="form__field-set">
      {children}
    </fieldset>
  );
}

export default Form__FieldSet;
