import React from 'react';
import TicketCard from "../ticket-card";
import Ticket from "../../types/ticket";
import stops from "../../constants/stops";

const TicketCardContainer: React.FC<Ticket> = ({price, carrier, segments}) => {
  const [
    forwardWaySegment,
    oppositeWaySegment,
  ] = segments;

  const getHoursFormatted = (date: Date): string => ("0" + date.getHours()).slice(-2);
  const getMinutesFormatted = (date: Date): string => ("0" + date.getMinutes()).slice(-2);

  function getOriginTime(datetime: string): string {
    const date = new Date(datetime);
    return `${getHoursFormatted(date)}:${getMinutesFormatted(date)}`;
  }

  function getDestinationTime(datetime: string, duration: number): string {
    const originDate = new Date(datetime);
    const destinationDate = new Date(originDate.getTime() + duration * 60000);
    return `${getHoursFormatted(destinationDate)}:${getMinutesFormatted(destinationDate)}`;
  }

  function getDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration - (hours * 60);
    return `${hours}ч ${minutes}м`;
  }

  function getStopsCount(segmentStops: Array<string>): string {
    const option = stops.find((stop) => stop.count === segmentStops.length);

    if (option) {
      return option.label;
    } else {
      return 'Без пересадок';
    }
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
        }
      ]}
    />
  );
};

export default TicketCardContainer;