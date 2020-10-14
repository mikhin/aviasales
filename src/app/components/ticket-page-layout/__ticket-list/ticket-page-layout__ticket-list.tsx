import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketPageLayout__TicketList: React.FC<propType> = ({ children }) => {
  return (
    <div className="ticket-page-layout__ticket-list">
      {children}
    </div>
  );
}

export default TicketPageLayout__TicketList;
