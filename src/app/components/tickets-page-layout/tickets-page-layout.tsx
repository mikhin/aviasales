import React from 'react';

import Page, { Page__Main, Page__Section, Page__Sidebar } from '../page';
import Filter from '../filter';
import FilterFormContainer from '../filter-form-container';
import SortingFormContainer from '../sorting-form-container';
import TicketList, { TicketList__Item } from '../ticket-list';
import TicketCardContainer from "../ticket-card-container";
import Throbber from "../throbber";
import ServiceErrorNotice from "../server-error-notice";
import EmptySearchResultsMessage from "../empty-search-results-message";

import Ticket from '../../types/ticket';
import { stopOptionsType } from "../filter-form";
import { sortingOptionsType } from "../sorting-form";

type propType = {
  displayableTickets: Array<Ticket>;
  canTicketsBeDisplayed: boolean;
  fetchStatus: string;
  isErrorWhileFetching: boolean;
  onFilterChange: (stopOptions: stopOptionsType) => void;
  onSortingChange: (sortingOptions: sortingOptionsType) => void;
  onReloadPage: () => void;
}

const fetchStatuses = {
  initial: null,
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
}

const TicketsPageLayout: React.FC<propType> = ({ displayableTickets, canTicketsBeDisplayed, fetchStatus, isErrorWhileFetching, onFilterChange, onSortingChange, onReloadPage }) => (
  <Page>
    <Page__Sidebar>
      <Filter>
        <FilterFormContainer
          onChange={onFilterChange}
        />
      </Filter>
    </Page__Sidebar>

    <Page__Main>
      <Page__Section>
        <SortingFormContainer
          onChange={onSortingChange}
        />
      </Page__Section>

      {fetchStatus === fetchStatuses.fetching && (
        <Page__Section>
          <Throbber caption="Загрузка билетов"/>
        </Page__Section>
      )}

      {isErrorWhileFetching && displayableTickets.length === 0 && (
        <Page__Section>
          <ServiceErrorNotice
            onReloadPage={onReloadPage}
          />
        </Page__Section>
      )}

      {!isErrorWhileFetching
      && displayableTickets.length === 0
      && canTicketsBeDisplayed
      && (
        <Page__Section>
          <EmptySearchResultsMessage/>
        </Page__Section>
      )}

      {displayableTickets.length > 0 && (
        <Page__Section>
          <TicketList>
            {displayableTickets.map((ticket: Ticket) => (
              <TicketList__Item key={`${ticket.carrier}/${ticket.price}`}>
                <TicketCardContainer
                  price={ticket.price}
                  carrier={ticket.carrier}
                  segments={ticket.segments}
                />
              </TicketList__Item>
            ))}
          </TicketList>
        </Page__Section>
      )}
    </Page__Main>
  </Page>
);

export default TicketsPageLayout;
