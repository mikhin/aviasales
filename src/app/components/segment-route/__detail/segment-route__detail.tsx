import React from 'react';

type propType = {
  id: string;
  term: string;
  definition: string;
};

const SegmentRoute__Detail: React.FC<propType> = ({ id, term, definition }) => {
  return (
    <div className={`segment-route__detail segment-route__detail_type_${id}`}>
      <dt className="segment-route__detail-term">{term}</dt>
      <dd className="segment-route__detail-definition">{definition}</dd>
    </div>
  );
}

export default SegmentRoute__Detail;
