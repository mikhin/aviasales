import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Form__Field: React.FC<Props> = React.memo(({ children }) => (
  <div className="form__field">
    {children}
  </div>
));
