import React from 'react';

import SegmentRoute from '../segment-route';

const TicketCard: React.FC = () => {
  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <h3 className="ticket-card__hidden-note">Билет направления MOW – HKT</h3>
        <span className="ticket-card__price">
          <span className="ticket-card__hidden-note">
            Стоимость билета:&nbsp;
          </span>
          13 400&nbsp;₽
        </span>
        <img className="ticket-card__company-logo" alt="" src="http://pics.avs.io/99/36/FV.png"/>
      </div>
      <div className="ticket-card__details">
        <div className="ticket-card__route-segment">
          <SegmentRoute
            origin="MOW"
            originTime="10:45"
            destination="HKT"
            destinationTime="08:00"
            duration="21ч 15м"
            stopTitle="2 пересадки"
            stops="HKG, JNB"
          />
        </div>
        <div className="ticket-card__route-segment">
          <SegmentRoute
            origin="HKT"
            originTime="11:20"
            destination="MOW"
            destinationTime="00:50"
            duration="13ч 30м"
            stopTitle="1 пересадка"
            stops="HKG"
          />
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
