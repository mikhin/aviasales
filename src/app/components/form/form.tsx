import React from 'react';

type Props = {
  children: React.ReactNode;
}

const Form: React.FC<Props> = ({children}) => {
  return (
    <form className="form">
      {children}
    </form>
  );
}

export default Form;
