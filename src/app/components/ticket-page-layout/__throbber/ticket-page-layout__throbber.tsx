import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketPageLayout__Throbber: React.FC<propType> = ({ children }) => {
  return (
    <div className="ticket-page-layout__throbber">
      {children}
    </div>
  );
};

export default TicketPageLayout__Throbber;
