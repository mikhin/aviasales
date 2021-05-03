import React from 'react';

type Props = {
  caption: string;
}

const LineThrobber: React.FC<Props> = ({caption}) => {
  return (
    <div className="line-throbber">
      <p className="line-throbber__text">
        {caption}
      </p>
    </div>
  );
};

export default LineThrobber;
