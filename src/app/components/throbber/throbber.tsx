import React from 'react';

type Props = {
  caption: string;
}

const Throbber: React.FC<Props> = ({caption}) => {
  return (
    <div className="throbber">
      <p className="throbber__text">
        {caption}
      </p>
    </div>
  );
};

export default Throbber;
