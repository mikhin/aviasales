import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Page, { Page__Main, Page__Section, Page__Sidebar } from '../../components/page';
import Filter from '../../components/filter';
import TicketsFilterFormContainer from '../../components/tickets-filter-form-container';
import SortingFormContainer from '../../components/sorting-form-container';
import Throbber from '../../components/throbber';
import ServiceErrorNotice from '../../components/server-error-notice';
import EmptySearchResultsMessage from '../../components/empty-search-results-message';
import TicketList, { TicketList__Item } from '../../components/ticket-list';
import TicketCardContainer from '../../components/ticket-card-container';
import { StopOptions } from "../../components/tickets-filter-form";
import { SortingOptions } from "../../components/sorting-form";

import Ticket from '../../types/ticket';
import retry from "../../helpers/retry";

const DISPLAYED_TICKETS_COUNT = 5;

type State = {
  searchId: string;
  tickets: Array<Ticket>;
  fetchStatus: string;
  selectedStopOptions: StopOptions;
  sortingOptions: SortingOptions;
  isErrorWhileFetching: boolean;
}

type CachedDisplayedTicketsStorageEntry = {
  key: string;
  source: Array<Ticket>;
  result: Array<Ticket>;
};

type CachedDisplayedTicketsStorage = Array<CachedDisplayedTicketsStorageEntry>;

const fetchStatuses = {
  initial: '',
  fetching: 'fetching',
  fetchingFinished: 'fetchingFinished',
}

class Tickets extends React.Component<RouteComponentProps, State> {
  state = {
    searchId: '',
    tickets: [],
    fetchStatus: fetchStatuses.initial,
    selectedStopOptions: [],
    sortingOptions: [],
    isErrorWhileFetching: false,
  }

  private cachedDisplayedTickets: CachedDisplayedTicketsStorage = [];
  private rawTickets: Array<Ticket> = [];

  async componentDidMount(): Promise<void> {
    await this.initializeSearchIdFetching();
    await this.initializeTicketsFetching();
  }

  initializeSearchIdFetching = async (): Promise<void> => {
    try {
      await retry(this.fetchSearchId, 3, 1000);
    } catch (error) {
      this.setState({
        isErrorWhileFetching: true,
        fetchStatus: fetchStatuses.fetchingFinished,
      })
    }
  }

  initializeTicketsFetching = async (): Promise<void> => {
    const { searchId, isErrorWhileFetching } = this.state
    if (searchId && !isErrorWhileFetching) {
      try {
        await retry(this.fetchTickets, 3, 1000);
      } catch (error) {
        this.setState({
          isErrorWhileFetching: this.rawTickets.length === 0,
          fetchStatus: fetchStatuses.fetchingFinished,
        })
      }
    }
  }

  getCachedDisplayedTickets = (tickets: Array<Ticket>, filter: StopOptions, sorting: SortingOptions): Array<Ticket> => {
    const filterKeyPart = filter.filter((option) => option.isChecked).map((option) => option.id).join('');
    const sortingKeyPart = sorting.filter((option) => option.isChecked).map((option) => option.id).join('');
    const cacheKey = `${filterKeyPart}/${sortingKeyPart}`;

    const cachedEntry = this.cachedDisplayedTickets.find((entry) => entry.key === cacheKey && entry.source === tickets);

    if (cachedEntry) {
      return cachedEntry.result;
    } else {
      const displayedTickets = this.getDisplayedTickets(tickets, filter, sorting);

      this.cachedDisplayedTickets = [...this.cachedDisplayedTickets, {
        key: cacheKey,
        source: tickets,
        result: displayedTickets,
      }]

      return displayedTickets;
    }
  }

  getDisplayedTickets = (tickets: Array<Ticket>, filter: StopOptions, sorting: SortingOptions): Array<Ticket> => {
    const sortingFunction = this.getSortingFunction(sorting);
    const stopCountsList = filter
      .filter((option) => option.isChecked)
      .map((option) => option.count)

    return [...tickets]
      .sort(sortingFunction)
      .filter((ticket: Ticket) => {
        return this.filterTicketsByStops(ticket, stopCountsList);
      })
      .slice(0, DISPLAYED_TICKETS_COUNT);
  }

  getSortingFunction = (sorting: SortingOptions): (a: Ticket, b: Ticket) => number => {
    const cheapestOption = sorting.find((option) => option.id === 'cheapest');

    if (cheapestOption && cheapestOption.isChecked) {
      return this.sortTicketsByPrice;
    }

    return this.sortTicketsByDuration;
  }

  sortTicketsByPrice = (a: Ticket, b: Ticket): number => a.price - b.price;

  sortTicketsByDuration = (a: Ticket, b: Ticket): number => {
    const [
      { duration: forwardDuration1 },
      { duration: oppositeDuration1 },
    ] = a.segments;

    const [
      { duration: forwardDuration2 },
      { duration: oppositeDuration2 },
    ] = b.segments;

    return (forwardDuration1 + oppositeDuration1) - (forwardDuration2 + oppositeDuration2);
  }

  filterTicketsByStops = (ticket: Ticket, filter: Array<(number | undefined)>): boolean => {
    if (filter.length > 0) {
      const [
        { stops: forwardStops },
        { stops: oppositeStops },
      ] = ticket.segments;

      return filter.includes(forwardStops.length) && filter.includes(oppositeStops.length);
    }

    return false;
  }

  onFilterChange = (filter: StopOptions): void => {
    const {
      sortingOptions
    } = this.state

    this.setState({
      selectedStopOptions: filter,
    })

    if (filter) {
      this.setState({
        tickets: this.getCachedDisplayedTickets(this.rawTickets, filter, sortingOptions),
      })
    }
  };

  onSortingChange = (sorting: SortingOptions): void => {
    const {
      selectedStopOptions
    } = this.state

    this.setState({
      sortingOptions: sorting,
    })

    if (sorting) {
      this.setState({
        tickets: this.getCachedDisplayedTickets(this.rawTickets, selectedStopOptions, sorting),
      })
    }
  };

  fetchSearchId = async (): Promise<void> => {
    this.setState({
      fetchStatus: fetchStatuses.fetching
    });

    try {
      const response = await fetch('/search');

      const { searchId } = await response.json();

      this.setState({
        searchId,
      })
    } catch (error) {
      throw error;
    }
  }

  fetchTickets = async (): Promise<void> => {
    const { searchId, selectedStopOptions, sortingOptions } = this.state;

    try {
      const response = await fetch(`/tickets?searchId=${searchId}`);

      const { tickets: fetchedTickets, stop } = await response.json();

      if (this.rawTickets.length === 0) {
        this.setState({
          fetchStatus: fetchStatuses.fetching,
          tickets: this.getCachedDisplayedTickets(fetchedTickets, selectedStopOptions, sortingOptions),
        });
      }

      this.rawTickets = [...this.rawTickets, ...fetchedTickets];

      if (stop) {
        this.setState({
          fetchStatus: fetchStatuses.fetchingFinished,
          tickets: this.getCachedDisplayedTickets(this.rawTickets, selectedStopOptions, sortingOptions),
        });
      } else {
        await this.fetchTickets();
      }
    } catch (error) {
      throw error;
    }
  }

  reloadPage = (): void => {
    window.location.reload();
  }

  render(): React.ReactNode {
    const {
      fetchStatus,
      tickets,
      isErrorWhileFetching
    } = this.state

    const areTicketsAvailable = tickets.length === 0 && this.rawTickets.length > 0;

    return (
    <Page>
      <Page__Sidebar>
        <Page__Section>
          <Filter>
            <TicketsFilterFormContainer
              onChange={this.onFilterChange}
            />
          </Filter>
        </Page__Section>

        {fetchStatus === fetchStatuses.fetching && (
          <Page__Section>
            <Throbber caption="Загрузка билетов"/>
          </Page__Section>
        )}
      </Page__Sidebar>

      <Page__Main>
        <Page__Section>
          <SortingFormContainer
            onChange={this.onSortingChange}
          />
        </Page__Section>

        {isErrorWhileFetching && tickets.length === 0 && (
          <Page__Section>
            <ServiceErrorNotice
              onReloadPage={this.reloadPage}
            />
          </Page__Section>
        )}

        {!isErrorWhileFetching && areTicketsAvailable && (
          <Page__Section>
            <EmptySearchResultsMessage/>
          </Page__Section>
        )}

        {tickets.length > 0 && (
          <Page__Section>
            <TicketList>
              {tickets.map((ticket: Ticket) => (
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
  }
}

export default withRouter(Tickets);
