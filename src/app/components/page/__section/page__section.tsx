import React from 'react';

type Props = {
  children: React.ReactNode;
}

export const Page__Section: React.FC<Props> = React.memo(({ children }) => (
  <section className="page__section">
    {children}
  </section>
));
