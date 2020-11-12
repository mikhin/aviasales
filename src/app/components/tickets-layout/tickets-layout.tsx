import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketsLayout: React.FC<propType> = ({ children }) => {
  return (
    <div className="tickets-layout">
      {children}
    </div>
  );
}

export default TicketsLayout;
