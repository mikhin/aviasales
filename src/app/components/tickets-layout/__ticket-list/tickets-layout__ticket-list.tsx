import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketsLayout__TicketList: React.FC<propType> = ({ children }) => {
  return (
    <div className="tickets-layout__ticket-list">
      {children}
    </div>
  );
}

export default TicketsLayout__TicketList;
