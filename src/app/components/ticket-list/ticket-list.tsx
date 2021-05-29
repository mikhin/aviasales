import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const TicketList: React.FC<Props> = React.memo(({ children }) => (
  <ul className="ticket-list">
    {children}
  </ul>
));
