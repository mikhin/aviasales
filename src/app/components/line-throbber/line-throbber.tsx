import React from 'react';

type Props = {
  caption: string;
}

export const LineThrobber: React.FC<Props> = ({ caption }) => (
  <div className="line-throbber">
    <p className="line-throbber__text">
      {caption}
    </p>
  </div>
);
