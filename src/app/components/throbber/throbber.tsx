import React from 'react';

type propType = {
  caption: string;
}

const Throbber: React.FC<propType> = ({caption}) => {
  return (
    <div className="throbber">
      <p className="throbber__text">
        {caption}
      </p>
    </div>
  );
};

export default Throbber;
