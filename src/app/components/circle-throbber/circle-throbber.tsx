import React from 'react';

type Props = {
  caption: string;
}

export const CircleThrobber: React.FC<Props> = ({caption}) => {
  return (
    <div className="circle-throbber">
      <p className="circle-throbber__text">
        {caption}
      </p>
    </div>
  );
};
