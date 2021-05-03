import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Page__Sidebar: React.FC<Props> = ({ children }) => {
  return (
    <aside className="page__sidebar">
      {children}
    </aside>
  );
};
