import React from 'react';
import { ReactComponent as LogoImage } from './logo.svg';

export const Logo: React.FC = React.memo(() => {
  return (
    <div className="logo">
      <LogoImage className="logo__image"/>
    </div>
  );
});
