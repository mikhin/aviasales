import React from 'react';

import { Logo } from 'app/components/logo';

type Props = {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => (
  <div className="app-layout">
    <div className="app-layout__content-wrapper">
      <div className="app-layout__trim">
        <header className="app-layout__header">
          <Logo/>
        </header>
        <div className="app-layout__content">
          {children}
        </div>
        <footer className="app-layout__footer"/>
      </div>
    </div>
  </div>
);
