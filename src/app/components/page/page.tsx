import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Page: React.FC<Props> = ({ children }) => (
  <div className="page">
    {children}
  </div>
);
