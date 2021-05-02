import React from 'react';

type Props = {
  children: React.ReactNode;
}

const Filter: React.FC<Props> = ({ children }) => {
  return (
    <div className="filter">
      {children}
    </div>
  );
}

export default Filter;
