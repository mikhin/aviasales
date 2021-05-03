import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const TicketList: React.FC<Props> = ({ children }) => {
  return (
    <ul className="ticket-list">
      {children}
    </ul>
  );
}
