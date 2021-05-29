import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Page: React.FC<Props> = React.memo(({ children }) => (
  <div className="page">
    {children}
  </div>
));
