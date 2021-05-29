import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Page__Sidebar: React.FC<Props> = React.memo(({ children }) => (
  <aside className="page__sidebar">
    {children}
  </aside>
));
