import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Form__FieldSet: React.FC<Props> = React.memo(({ children }) => (
  <fieldset className="form__field-set">
    {children}
  </fieldset>
));
