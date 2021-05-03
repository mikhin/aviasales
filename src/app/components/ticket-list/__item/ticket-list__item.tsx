import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const TicketList__Item: React.FC<Props> = ({ children }) => {
  return (
    <li className="ticket-list__item">
      {children}
    </li>
  );
};
