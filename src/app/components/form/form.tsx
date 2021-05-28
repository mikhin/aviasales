import React from 'react';
import b from 'bem-react-helper';

type Props = {
  children: React.ReactNode;
  mix: string;
}

export const Form: React.FC<Props> = ({ children, mix }) => (
  <form className={b('form', { mix })}>
    {children}
  </form>
);
