import React from 'react';

type propType = {
  children: React.ReactNode;
}

const TicketsLayout__SortingControl: React.FC<propType> = ({ children }) => {
  return (
    <div className="tickets-layout__sorting-control">
      {children}
    </div>
  );
};

export default TicketsLayout__SortingControl;
