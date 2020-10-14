import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Filter: React.FC<propType> = ({ children }) => {
  return (
    <div className="filter">
      {children}
    </div>
  );
}

export default Filter;
