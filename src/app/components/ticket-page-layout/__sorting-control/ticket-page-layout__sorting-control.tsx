import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketPageLayout__SortingControl: React.FC<propType> = ({ children }) => {
  return (
    <div className="ticket-page-layout__sorting-control">
      {children}
    </div>
  );
};

export default TicketPageLayout__SortingControl;
