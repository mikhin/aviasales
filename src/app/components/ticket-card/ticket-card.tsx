import React from 'react';

import { StopOption } from 'app/types/stop-option';
import { AirRouteSegment } from 'app/components/air-route-segment';

import { Ticket } from 'app/types/ticket';

import { getFormattedOriginTime } from 'app/helpers/formatters/get-formatted-origin-time';
import { getFormattedDestinationTime } from 'app/helpers/formatters/get-formatted-destination-time';
import { getFormattedFlyDuration } from 'app/helpers/formatters/get-formatted-fly-duration';
import { getFormattedTicketPrice } from 'app/helpers/formatters/get-formatted-ticket-price';
import { getFormattedAirTransfers } from 'app/helpers/formatters/get-formatted-air-transfers';
import { getFormattedAirTransfersCount } from 'app/helpers/formatters/get-formatted-air-transfers-count';

type Props = Ticket & {
  stopOptions: StopOption[];
};

export const TicketCard: React.FC<Props> = React.memo(({ price, carrier, segments, stopOptions }) => {
  const [
    forwardWaySegment,
    oppositeWaySegment,
  ] = segments;

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <h3 className="ticket-card__hidden-note">Билет направления ${forwardWaySegment.origin} – {forwardWaySegment.destination}</h3>
        <span className="ticket-card__price">
          <span className="ticket-card__hidden-note">
            Стоимость билета:&nbsp;
          </span>
          {getFormattedTicketPrice(price)}&nbsp;₽
        </span>
        <img className="ticket-card__company-logo" alt="" src={`http://pics.avs.io/99/36/${carrier}.png`}/>
      </div>
      <div className="ticket-card__details">
        <div className="ticket-card__route-segment">
          <AirRouteSegment
            origin={forwardWaySegment.origin}
            originTime={getFormattedOriginTime(forwardWaySegment.date)}
            destination={forwardWaySegment.destination}
            destinationTime={getFormattedDestinationTime(forwardWaySegment.date, forwardWaySegment.duration)}
            duration={getFormattedFlyDuration(forwardWaySegment.duration)}
            stopsCount={getFormattedAirTransfersCount(stopOptions, forwardWaySegment.stops)}
            stops={getFormattedAirTransfers(forwardWaySegment.stops)}
          />
        </div>
        <div className="ticket-card__route-segment">
          <AirRouteSegment
            origin={oppositeWaySegment.origin}
            originTime={getFormattedOriginTime(oppositeWaySegment.date)}
            destination={oppositeWaySegment.destination}
            destinationTime={getFormattedDestinationTime(oppositeWaySegment.date, oppositeWaySegment.duration)}
            duration={getFormattedFlyDuration(oppositeWaySegment.duration)}
            stopsCount={getFormattedAirTransfersCount(stopOptions, oppositeWaySegment.stops)}
            stops={getFormattedAirTransfers(oppositeWaySegment.stops)}
            isOpposite
          />
        </div>
      </div>
    </div>
  );
});
