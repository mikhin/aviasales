import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketList: React.FC<propType> = ({ children }) => {
  return (
    <ul className="ticket-list">
      {children}
    </ul>
  );
}

export default TicketList;
