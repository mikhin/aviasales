import React from 'react';

type Props = {
  children: React.ReactNode;
}

const Page__Main: React.FC<Props> = ({ children }) => {
  return (
    <main className="page__main">
      {children}
    </main>
  );
};

export default Page__Main;
