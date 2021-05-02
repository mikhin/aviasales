import React from 'react';

type Props = {
  children: React.ReactNode;
}

const TicketsFilter: React.FC<Props> = ({ children }) => {
  return (
    <div className="tickets-filter">
      {children}
    </div>
  );
}

export default TicketsFilter;
