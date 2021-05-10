import React from 'react';

type Props = {
  id: string;
  term: string;
  definition: string;
};

export const AirRouteSegment__Detail: React.FC<Props> = ({ id, term, definition }) => (
  <div className={`air-route-segment__detail air-route-segment__detail_type_${id}`}>
    <dt className="air-route-segment__detail-term">{term}</dt>
    <dd className="air-route-segment__detail-definition">{definition}</dd>
  </div>
);
