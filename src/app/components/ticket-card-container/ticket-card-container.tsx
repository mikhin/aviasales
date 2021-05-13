import React from 'react';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import format from 'date-fns/format';

import { TicketCard } from 'app/components/ticket-card';
import { StopOptions } from 'app/components/tickets-filter-form';

import { Ticket } from 'app/types/ticket';

type Props = Ticket & {
  stopOptions: StopOptions;
}

const TIME_ZONE = 'Europe/Moscow';

export const TicketCardContainer: React.FC<Props> = React.memo(({ price, carrier, segments, stopOptions }) => {
  const [
    forwardWaySegment,
    oppositeWaySegment,
  ] = segments;

  function getOriginTime(datetime: string): string {
    const date = utcToZonedTime(datetime, TIME_ZONE);
    format(date, 'HH:mm');
    return format(date, 'HH:mm');
  }

  function getDestinationTime(datetime: string, duration: number): string {
    const originDate = utcToZonedTime(datetime, TIME_ZONE);

    const destinationDate = new Date(originDate.getTime() + duration * 60000);
    return format(destinationDate, 'HH:mm');
  }

  function getDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration - (hours * 60);
    return `${hours}ч ${minutes}м`;
  }

  function getStopsCount(segmentStops: Array<string>): string {
    const option = stopOptions.find((stop) => stop.count === segmentStops.length);

    if (option) {
      return option.label;
    }
    return 'Без пересадок';
  }

  function getStops(segmentStops: Array<string>): string {
    return segmentStops.join(', ');
  }

  return (
    <TicketCard
      price={price}
      carrier={carrier}
      segments={[
        {
          origin: forwardWaySegment.origin,
          originTime: getOriginTime(forwardWaySegment.date),
          destination: forwardWaySegment.destination,
          destinationTime: getDestinationTime(forwardWaySegment.date, forwardWaySegment.duration),
          duration: getDuration(forwardWaySegment.duration),
          stopsCount: getStopsCount(forwardWaySegment.stops),
          stops: getStops(forwardWaySegment.stops),
        },
        {
          origin: oppositeWaySegment.origin,
          originTime: getOriginTime(oppositeWaySegment.date),
          destination: oppositeWaySegment.destination,
          destinationTime: getDestinationTime(oppositeWaySegment.date, oppositeWaySegment.duration),
          duration: getDuration(oppositeWaySegment.duration),
          stopsCount: getStopsCount(oppositeWaySegment.stops),
          stops: getStops(oppositeWaySegment.stops),
        },
      ]}
    />
  );
});
