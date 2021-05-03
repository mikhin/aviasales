import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Form__Legend: React.FC<Props> = React.memo(({children}) => {
  return (
    <legend className="form__legend">
      {children}
    </legend>
  );
});
