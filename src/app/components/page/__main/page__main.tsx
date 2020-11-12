import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Page__Main: React.FC<propType> = ({ children }) => {
  return (
    <main className="page__main">
      {children}
    </main>
  );
};

export default Page__Main;
