import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketPageLayout__Filter: React.FC<propType> = ({ children }) => {
  return (
    <div className="ticket-page-layout__filter">
      {children}
    </div>
  );
};

export default TicketPageLayout__Filter;
