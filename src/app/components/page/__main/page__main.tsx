import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Page__Main: React.FC<Props> = ({ children }) => (
  <main className="page__main">
    {children}
  </main>
);
