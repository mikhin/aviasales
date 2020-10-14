import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketPageLayout__Error: React.FC<propType> = ({ children }) => {
  return (
    <div className="ticket-page-layout__error">
      {children}
    </div>
  );
};

export default TicketPageLayout__Error;
