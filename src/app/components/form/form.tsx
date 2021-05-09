import React from 'react';

type Props = {
  children: React.ReactNode;
  mix: string;
}

export const Form: React.FC<Props> = ({ children, mix }) => (
  <form className={`form ${mix}`}>
    {children}
  </form>
);
