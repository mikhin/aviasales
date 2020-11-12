import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketsLayout__Throbber: React.FC<propType> = ({ children }) => {
  return (
    <div className="tickets-layout__throbber">
      {children}
    </div>
  );
};

export default TicketsLayout__Throbber;
