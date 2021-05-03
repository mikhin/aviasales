import React from 'react';
import { AirRouteSegment__Detail } from 'app/components/air-route-segment/__detail';

export type Props = {
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  duration: string;
  stopsCount: string;
  stops: string;
};

export const AirRouteSegment: React.FC<Props> = React.memo(({ origin, originTime, destination, destinationTime, duration, stopsCount, stops }) => {
  return (
    <div className="air-route-segment">
      <div className="air-route-segment__header">
        <h3 className="air-route-segment__title">Туда: {origin} – {destination}</h3>
      </div>
      <dl className="air-route-segment__details">
        <AirRouteSegment__Detail
          id="origin-destination"
          term={`${origin} – ${destination}`}
          definition={`${originTime} – ${destinationTime}`}
        />
        <AirRouteSegment__Detail
          id="duration"
          term="В пути"
          definition={duration}
        />
        <AirRouteSegment__Detail
          id="stops-count"
          term={stopsCount}
          definition={stops}
        />
      </dl>
    </div>
  );
});
