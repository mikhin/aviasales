import React from 'react';

type propType = {
  term: string;
  definition: string;
};

const SegmentRoute__Detail: React.FC<propType> = ({ term, definition }) => {
  return (
    <div className="segment-route__detail">
      <dt className="segment-route__detail-term">{term}</dt>
      <dd className="segment-route__detail-definition">{definition}</dd>
    </div>
  );
}

export default SegmentRoute__Detail;
