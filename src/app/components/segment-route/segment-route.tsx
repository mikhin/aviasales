import React from 'react';
import SegmentRoute__Detail from './__detail';

type propType = {
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  duration: string;
  stopTitle: string;
  stops: string;
};

const SegmentRoute: React.FC<propType> = ({ origin, originTime, destination, destinationTime, duration, stopTitle, stops }) => {
  return (
    <div className="segment-route">
      <div className="segment-route__header">
        <h3 className="segment-route__title">Туда: {origin} – {destination}</h3>
      </div>
      <dl className="segment-route__details">
        <SegmentRoute__Detail
          term={`${origin} – ${destination}`}
          definition={`${originTime} – ${destinationTime}`}
        />
        <SegmentRoute__Detail
          term="В пути"
          definition={duration}
        />
        <SegmentRoute__Detail
          term={stopTitle}
          definition={stops}
        />
      </dl>
    </div>
  );
}

export default SegmentRoute;
