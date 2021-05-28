import React from 'react';
import b from 'bem-react-helper';

type Props = {
  id: string;
  term: string;
  definition: string;
};

export const AirRouteSegment__Detail: React.FC<Props> = ({ id, term, definition }) => (
  <div className={b('air-route-segment__detail', {}, { type: id })}>
    <dt className="air-route-segment__detail-term">{term}</dt>
    <dd className="air-route-segment__detail-definition">{definition}</dd>
  </div>
);
