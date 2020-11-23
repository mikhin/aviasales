import React from 'react';
import SegmentRoute__Detail from './__detail';

export type propType = {
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  duration: string;
  stopsCount: string;
  stops: string;
};

const SegmentRoute: React.FC<propType> = ({ origin, originTime, destination, destinationTime, duration, stopsCount, stops }) => {
  return (
    <div className="segment-route">
      <div className="segment-route__header">
        <h3 className="segment-route__title">Туда: {origin} – {destination}</h3>
      </div>
      <dl className="segment-route__details">
        <SegmentRoute__Detail
          id="origin-destination"
          term={`${origin} – ${destination}`}
          definition={`${originTime} – ${destinationTime}`}
        />
        <SegmentRoute__Detail
          id="duration"
          term="В пути"
          definition={duration}
        />
        <SegmentRoute__Detail
          id="stops-count"
          term={stopsCount}
          definition={stops}
        />
      </dl>
    </div>
  );
}

export default SegmentRoute;
