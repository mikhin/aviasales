import React from 'react';

import Logo from '../logo';

type propType = {
  children: React.ReactNode;
}

const Page: React.FC<propType> = ({ children }) => {
  return (
    <div className="page">
      <div className="page__content-wrapper">
        <div className="page__trim">
          <header className="page__header">
            <Logo/>
          </header>
          <div className="page__content">
            {children}
          </div>
          <footer className="page__footer"/>
        </div>
      </div>
    </div>
  );
}

export default Page;
