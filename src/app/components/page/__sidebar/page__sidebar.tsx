import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Page__Sidebar: React.FC<propType> = ({ children }) => {
  return (
    <aside className="page__sidebar">
      {children}
    </aside>
  );
};

export default Page__Sidebar;
