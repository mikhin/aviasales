import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketPageLayout: React.FC<propType> = ({ children }) => {
  return (
    <div className="ticket-page-layout">
      {children}
    </div>
  );
}

export default TicketPageLayout;
