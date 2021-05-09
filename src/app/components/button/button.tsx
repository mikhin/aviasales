import React from 'react';
import b from 'bem-react-helper';

type Props = {
  mix?: string;
  mods?: {
    theme?: string;
    size?: string;
    wide?: boolean;
  };
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({ mods, onClick, children, mix }) => (
  <button
    type="button"
    onClick={onClick}
    className={b('button', { mods, mix })}
  >
    {children}
  </button>
);
