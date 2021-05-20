import React from 'react';
import b from 'bem-react-helper';

type Props = {
  mix?: string;
  theme?: string;
  size?: string;
  wide?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<Props> = ({ theme, size, wide, onClick, children, mix }) => (
  <button
    type="button"
    onClick={onClick}
    className={b('button', { mods: { theme, size, wide }, mix })}
  >
    {children}
  </button>
);
