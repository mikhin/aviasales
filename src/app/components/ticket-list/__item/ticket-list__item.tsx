import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const TicketList__Item: React.FC<Props> = React.memo(({ children }) => (
  <li className="ticket-list__item">
    {children}
  </li>
));
