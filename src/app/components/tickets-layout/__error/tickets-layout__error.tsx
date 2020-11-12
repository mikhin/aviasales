import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketsLayout__Error: React.FC<propType> = ({ children }) => {
  return (
    <div className="tickets-layout__error">
      {children}
    </div>
  );
};

export default TicketsLayout__Error;
