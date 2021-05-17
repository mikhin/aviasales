import React from 'react';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import format from 'date-fns/format';

import { StopOption } from 'app/components/tickets-filter-form';
import { AirRouteSegment } from 'app/components/air-route-segment';

import { Ticket } from 'app/types/ticket';
import { timeZone } from 'app/constants/time-zone';

type Props = Ticket & {
  stopOptions: StopOption[];
};

const ONE_MINUTE_MILLISECONDS = 60000;

export const TicketCard: React.FC<Props> = React.memo(({ price, carrier, segments, stopOptions }) => {
  const [
    forwardWaySegment,
    oppositeWaySegment,
  ] = segments;

  const getOriginTime = (datetime: string): string => {
    const date = utcToZonedTime(datetime, timeZone);
    return format(date, 'HH:mm');
  };

  const getDestinationTime = (datetime: string, duration: number): string => {
    const originDate = utcToZonedTime(datetime, timeZone);

    const destinationDate = new Date(originDate.getTime() + duration * ONE_MINUTE_MILLISECONDS);
    return format(destinationDate, 'HH:mm');
  };

  const getDuration = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration - (hours * 60);
    return `${hours}ч ${minutes}м`;
  };

  const getStopsCount = (segmentStops: string[]): string => {
    const option = stopOptions.find((stop) => stop.count === segmentStops.length);

    if (option) {
      return option.label;
    }
    return 'Без пересадок';
  };

  const getStops = (segmentStops: string[]): string => segmentStops.join(', ');

  const formattedPrice = price.toLocaleString().split(',').join(' ');

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <h3 className="ticket-card__hidden-note">Билет направления ${forwardWaySegment.origin} – {forwardWaySegment.destination}</h3>
        <span className="ticket-card__price">
          <span className="ticket-card__hidden-note">
            Стоимость билета:&nbsp;
          </span>
          {formattedPrice}&nbsp;₽
        </span>
        <img className="ticket-card__company-logo" alt="" src={`http://pics.avs.io/99/36/${carrier}.png`}/>
      </div>
      <div className="ticket-card__details">
        <div className="ticket-card__route-segment">
          <AirRouteSegment
            origin={forwardWaySegment.origin}
            originTime={getOriginTime(forwardWaySegment.date)}
            destination={forwardWaySegment.destination}
            destinationTime={getDestinationTime(forwardWaySegment.date, forwardWaySegment.duration)}
            duration={getDuration(forwardWaySegment.duration)}
            stopsCount={getStopsCount(forwardWaySegment.stops)}
            stops={getStops(forwardWaySegment.stops)}
          />
        </div>
        <div className="ticket-card__route-segment">
          <AirRouteSegment
            origin={oppositeWaySegment.origin}
            originTime={getOriginTime(oppositeWaySegment.date)}
            destination={oppositeWaySegment.destination}
            destinationTime={getDestinationTime(oppositeWaySegment.date, oppositeWaySegment.duration)}
            duration={getDuration(oppositeWaySegment.duration)}
            stopsCount={getStopsCount(oppositeWaySegment.stops)}
            stops={getStops(oppositeWaySegment.stops)}
            isOpposite
          />
        </div>
      </div>
    </div>
  );
});
