import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketList__Item: React.FC<propType> = ({ children }) => {
  return (
    <li className="ticket-list__item">
      {children}
    </li>
  );
}

export default TicketList__Item;
