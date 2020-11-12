import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketsLayout__Filter: React.FC<propType> = ({ children }) => {
  return (
    <div className="tickets-layout__filter">
      {children}
    </div>
  );
};

export default TicketsLayout__Filter;
