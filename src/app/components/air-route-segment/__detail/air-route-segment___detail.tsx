import React from 'react';

type Props = {
  id: string;
  term: string;
  definition: string;
};

const AirRouteSegment__Detail: React.FC<Props> = ({ id, term, definition }) => {
  return (
    <div className={`air-route-segment__detail air-route-segment__detail_type_${id}`}>
      <dt className="air-route-segment__detail-term">{term}</dt>
      <dd className="air-route-segment__detail-definition">{definition}</dd>
    </div>
  );
}

export default AirRouteSegment__Detail;
