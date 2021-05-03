import React from 'react';

import { AirRouteSegment, Props as SegmentType} from 'app/components/air-route-segment';

import { Override } from "app/types/override";
import { Ticket } from "app/types/ticket";

type Props = Override<Ticket, {
  segments: Array<SegmentType>;
}>;

export const TicketCard: React.FC<Props> = React.memo(({price, carrier, segments}) => {
  const [
    forwardWaySegment,
    oppositeWaySegment,
  ] = segments;

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <h3 className="ticket-card__hidden-note">Билет направления MOW – HKT</h3>
        <span className="ticket-card__price">
          <span className="ticket-card__hidden-note">
            Стоимость билета:&nbsp;
          </span>
          {price}&nbsp;₽
        </span>
        <img className="ticket-card__company-logo" alt="" src={`http://pics.avs.io/99/36/${carrier}.png`}/>
      </div>
      <div className="ticket-card__details">
        <div className="ticket-card__route-segment">
          <AirRouteSegment
            origin={forwardWaySegment.origin}
            originTime={forwardWaySegment.originTime}
            destination={forwardWaySegment.destination}
            destinationTime={forwardWaySegment.destinationTime}
            duration={forwardWaySegment.duration}
            stopsCount={forwardWaySegment.stopsCount}
            stops={forwardWaySegment.stops}
          />
        </div>
        <div className="ticket-card__route-segment">
          <AirRouteSegment
            origin={oppositeWaySegment.origin}
            originTime={oppositeWaySegment.originTime}
            destination={oppositeWaySegment.destination}
            destinationTime={oppositeWaySegment.destinationTime}
            duration={oppositeWaySegment.duration}
            stopsCount={oppositeWaySegment.stopsCount}
            stops={oppositeWaySegment.stops}
          />
        </div>
      </div>
    </div>
  );
});
