import React from 'react';

type propType = {
  children: React.ReactNode;
}

const Page__Section: React.FC<propType> = ({ children }) => {
  return (
    <section className="page__section">
      {children}
    </section>
  );
};

export default Page__Section;
