import React from 'react';

import { Logo } from '../logo';

type Props = {
  children: React.ReactNode;
}

export const Page: React.FC<Props> = ({ children }) => {
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
