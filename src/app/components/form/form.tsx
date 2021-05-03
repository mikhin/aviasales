import React from 'react';

type Props = {
  children: React.ReactNode;
  mix: string;
}

const Form: React.FC<Props> = ({children, mix}) => {
  return (
    <form className={`form ${mix}`}>
      {children}
    </form>
  );
}

export default Form;
